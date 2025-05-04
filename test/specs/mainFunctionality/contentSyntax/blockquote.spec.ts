import * as fs from 'fs/promises';
import UserActions from '../../../helpers/posts.ts';
import { MainPage } from '../../../pageobjects/main.page.ts';
import SyntaxElements from '../../../pageobjects/syntax.ts';

let syntaxPostsToCheck: Array<{ id: number, text: string, [key: string]: any }> = [];
let userData: { id: number, username: string, password: string }[] = [];
let masterUsername;
let masterPassword;
let mainPage = new MainPage();
let syntax = new SyntaxElements();
let userActions = new UserActions();

describe("Syntax blocks validation suite", function () {
    before(async () => {
        try {
            const syntaxData = await fs.readFile("test/data/syntax.json", "utf-8");
            syntaxPostsToCheck = JSON.parse(syntaxData);
        } catch (error) {
            console.error("❌ Error reading posts data:", error);
            throw error;
        }

        try {
            const usersRaw = await fs.readFile("test/data/users.json", "utf-8");
            userData = JSON.parse(usersRaw);
            const masterUser = userData.find((user) => user.id === 0);
            if (!masterUser) {
                throw new Error("❌ masterUser with id=0 not found in users.json");
            }
            masterUsername = masterUser.username;
            masterPassword = masterUser.password;
        } catch (error) {
            console.error("❌ Error reading user data:", error);
            throw error;
        }

        await mainPage.login(masterUsername, masterPassword);
    });

    describe("Code block item creation and validation", function () {
        it("creates a code block item", async function () {
            await mainPage.postTextArea.isDisplayed();
            await userActions.createPost(16, syntaxPostsToCheck);
        });

        describe("Validates code block item", function () {
            let validation: any;

            before(() => {
                const postData = syntaxPostsToCheck.find(elem => elem.id === 16);
                if (!postData) throw new Error("postData was undefined");
                validation = postData!.validation;
            });

            it("has correct tag", async function () {
                await syntax.codeBlock.isDisplayed();
                expect(await syntax.codeBlock.getTagName()).toBe(validation.tag);
            });

            it("has correct font-family", async function () {
                const fontFamily = (await syntax.codeBlock.getCSSProperty("font-family")).parsed.value.join(', ');
                expect(fontFamily).toBe(validation.styles['font-family']);
            });

            it("has correct font size", async function () {
                expect((await syntax.codeBlock.getCSSProperty("font-size")).value).toBe(validation.styles["font-size"]);
            });

            it("has correct line-height", async function () {
                expect((await syntax.codeBlock.getCSSProperty("line-height")).value).toBe(validation.styles["line-height"]);
            });

            it("has correct padding-left", async function () {
                expect((await syntax.codeBlock.getCSSProperty("padding-left")).value).toBe(validation.styles["padding-left"]);
            });

            it("has correct padding-right", async function () {
                expect((await syntax.codeBlock.getCSSProperty("padding-right")).value).toBe(validation.styles["padding-right"]);
            });

            it("has correct border-radius", async function () {
                expect((await syntax.codeBlock.getCSSProperty("border-radius")).value).toBe(validation.styles["border-radius"]);
            });

            it("has correct opacity", async function () {
                expect((await syntax.codeBlock.getCSSProperty("opacity")).value).toBe(validation.styles["opacity"]);
            });

            it("has correct background-color", async function () {
                expect((await syntax.codeBlock.getCSSProperty("background-color")).value).toBe(validation.styles["background-color"]);
            });
        });
    });

    describe("Blockquote item creation and validation", function () {
        it("creates a blockquote item", async function () {
            await userActions.createPost(17, syntaxPostsToCheck);
        });

        describe("Validates blockquote item", function () {
            let validation: any;

            before(() => {
                const postData = syntaxPostsToCheck.find(elem => elem.id === 17);
                if (!postData) throw new Error("postData was undefined");
                validation = postData!.validation;
            });

            const getCssValue = async (property: string) => {
                const raw = await syntax.codeBlock.getCSSProperty(property);
                return raw?.value?.replace(/\s+/g, "") ?? "";
            };

            const simpleProps = [
                "padding-left",
                "padding-right",
                "padding-top",
                "padding-bottom",
                "border-inline-start-width",
                "border-radius",
            ];

            it("has correct padding properties", async function () {
                for (const prop of simpleProps) {
                    expect(await getCssValue(prop)).toBe(validation.styles[prop].replace(/\s+/g, ""));
                }
            });

            it("has correct background-color", async function () {
                expect(
                    (validation.styles["background-color"] as string[]).map(v => v.replace(/\s+/g, ""))
                ).toContain(await getCssValue("background-color"));
            });

            it("has correct border-color", async function () {
                expect(
                    (validation.styles["background-color"] as string[]).map(v => v.replace(/\s+/g, ""))
                ).toContain(await getCssValue("border-color"));
            });
        });
    });

    describe("Deletes all posts", function () {
        it("deletes all posts", async function () {
            this.retries(1);
            await userActions.deleteAllPosts();
        });
    });
});
