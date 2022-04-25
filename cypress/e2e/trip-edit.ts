import faker from "@faker-js/faker";

describe("trip edit tests", () => {
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

  beforeEach(() => {
    cy.login();
    cy.visit("/");

    cy.findByRole("link", { name: /trips/i }).click();
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
    cy.findByRole("button", { name: /save/i }).click();
  });

  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to edit a trip", () => {
    cy.findByRole("link", { name: /edit/i }).click();
    cy.findByRole("textbox", { name: /destination:/i })
      .clear()
      .type("Berlin");
    cy.findByRole("button", { name: /save/i }).click();
    cy.findByText(/Berlin/i).should("exist");
  });

  it("should not allow you to edit a trip if missing destination", () => {
    cy.findByRole("link", { name: /edit/i }).click();
    cy.findByRole("textbox", { name: /destination:/i }).clear();
    cy.findByRole("button", { name: /save/i }).click();
    cy.findByText(/destination is required/i).should("exist");
  });
});
