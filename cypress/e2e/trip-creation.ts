import faker from "@faker-js/faker";

describe("trip creation tests", () => {
  const testTrip = {
    from: "2022-01-01",
    to: "2022-01-03",
    destination: faker.lorem.words(1),
    country: faker.lorem.words(1),
    description: faker.lorem.sentences(2),
    flights: "2",
    lat: "23.23",
    long: "24.24",
  };

  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to create and then delete a trip", () => {
    cy.login();
    cy.visit("/");

    cy.findByRole("link", { name: /dashboard/i }).click();
    cy.findByRole("link", { name: /\+ new trip/i }).click();

    cy.get('[data-testid="new-trip-from-input"]').type(testTrip.from);
    cy.get('[data-testid="new-trip-to-input"]').type(testTrip.to);
    cy.findByRole("textbox", { name: /destination:/i }).type(
      testTrip.destination
    );
    cy.findByRole("textbox", { name: /country:/i }).type(testTrip.country);
    cy.findByRole("textbox", { name: /description:/i }).type(
      testTrip.description
    );
    cy.findByRole("spinbutton", { name: /flights:/i }).type(testTrip.flights);
    cy.findByRole("textbox", { name: /latitude:/i }).type(testTrip.lat);
    cy.findByRole("textbox", { name: /longitude:/i }).type(testTrip.long);
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByRole("button", { name: /delete/i }).click();
    cy.findByText("No trips yet");
  });
});
