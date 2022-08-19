import { faker } from "@faker-js/faker";

describe("trip creation tests", () => {
  const testTrip = {
    from: "2022-01-01",
    to: "2099-01-03",
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

  it("should create and then delete a trip", () => {
    cy.login();
    cy.visitAndCheck("/");

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

    cy.findByRole("button", { name: /delete/i }).click();
    cy.findByText("No trips yet");
  });

  it("should create a secret trip only visible to creator", () => {
    cy.login();
    cy.visitAndCheck("/");

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
    cy.findByRole("checkbox", { name: /private/i }).click();
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByRole("button", { name: /delete/i }).should("exist");
    cy.findByRole("link", { name: /profile/i }).click();
    cy.findByText(testTrip.destination).should("exist");

    cy.logout();
    cy.reload();
    cy.findByText(/unique destinations/i).should("exist");
    cy.findByText(testTrip.destination).should("not.exist");
  });

  it("should create an upcoming trip only visible to creator", () => {
    cy.login();
    cy.visitAndCheck("/");

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
    cy.findByRole("checkbox", { name: /trip is over/i }).click();
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByRole("button", { name: /delete/i }).should("exist");
    cy.findByRole("link", { name: /profile/i }).click();
    cy.findByText(testTrip.destination).should("exist");

    cy.logout();
    cy.reload();
    cy.findByText(/unique destinations/i).should("exist");
    cy.findByText(testTrip.destination).should("not.exist");
  });
});
