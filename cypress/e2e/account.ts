import faker from "@faker-js/faker";

describe("account username tests", () => {
  const newUsername = "TESTUSERNAME";

  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow to change username", () => {
    cy.login();
    cy.visit("/");

    cy.findByRole("link", { name: /account/i }).click();

    cy.findByRole("textbox", { name: /username:/i }).type(newUsername);
    cy.findByRole("button", { name: /change username/i }).click();
  });
});

describe("account deletion tests", () => {
  it("should allow to delete account with confirmation", () => {
    cy.login();
    cy.visit("/");

    cy.findByRole("link", { name: /account/i }).click();

    cy.findByRole("link", {
      name: /delete my account and all trips/i,
    }).click();

    // Confirmation page
    cy.findByRole("link", { name: /export/i });
    cy.findByRole("button", {
      name: /delete my account and all trips/i,
    }).click();

    // Should be able to directly sign up again
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
      username: faker.hacker.noun(),
    };

    cy.findByRole("link", { name: /sign up/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("textbox", { name: /username/i }).type(loginForm.username);
    cy.findByRole("button", { name: /create account/i }).click();
  });
});
