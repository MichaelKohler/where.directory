import * as React from "react";
import Map, { Marker } from "react-map-gl";
import type { MapLayerMouseEvent, MarkerDragEvent } from "react-map-gl";
import {
  Form,
  useActionData,
  useMatches,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import type { TripClientResponse } from "../models/trip.server";

type Response = {
  mapboxToken: string;
};

type ActionResponse = {
  errors: {
    to: string;
    from: string;
    destination: string;
    country: string;
    description: string;
    lat: string;
    long: string;
    flights: string;
    generic: string;
  };
};

export default function TripForm({
  initialData,
}: {
  initialData?: TripClientResponse;
}) {
  const actionData = useActionData<ActionResponse>();
  const data = useLoaderData<Response>();
  const navigation = useNavigation();
  const [lat, setLatitude] = React.useState<number>(0);
  const [long, setLongitude] = React.useState<number>(0);
  const [showHideUpcomingCheckbox, setShowHideUpcomingCheckbox] =
    React.useState(initialData?.hideUpcoming || false);
  const matches = useMatches();

  const fromRef = React.useRef<HTMLInputElement>(null);
  const toRef = React.useRef<HTMLInputElement>(null);
  const destinationRef = React.useRef<HTMLInputElement>(null);
  const countryRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const flightsRef = React.useRef<HTMLInputElement>(null);

  const isEdit = !!initialData?.id;

  const parentRouteData = matches.find((match) => match.id === "routes/trips")
    ?.data as any;
  const trips = parentRouteData?.tripListItems;

  const handleLocationCopy = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "") {
      return;
    }

    const [lat, long] = event.target.value.split(";");
    setLatitude(parseFloat(lat));
    setLongitude(parseFloat(long));
  };

  const setLocation = (event: MarkerDragEvent | MapLayerMouseEvent) => {
    setLatitude(event.lngLat.lat);
    setLongitude(event.lngLat.lng);
  };

  const decideToShowHideUpcomingCheckbox = (date: Date) => {
    const today = new Date();
    if (date > today) {
      setShowHideUpcomingCheckbox(true);
      return;
    }

    setShowHideUpcomingCheckbox(false);
  };

  const handleUntilDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target && event.target.value) {
      decideToShowHideUpcomingCheckbox(new Date(event.target.value));
    }
  };

  React.useEffect(() => {
    if (actionData?.errors?.to) {
      toRef.current?.focus();
    } else if (actionData?.errors?.from) {
      fromRef.current?.focus();
    } else if (actionData?.errors?.destination) {
      destinationRef.current?.focus();
    } else if (actionData?.errors?.country) {
      countryRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    } else if (actionData?.errors?.flights) {
      flightsRef.current?.focus();
    }
  }, [actionData]);

  React.useEffect(() => {
    if (initialData) {
      setLatitude(initialData.lat);
      setLongitude(initialData.long);

      decideToShowHideUpcomingCheckbox(new Date(initialData.to));
    }
  }, [initialData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>From: </span>
          <input
            ref={fromRef}
            type="date"
            name="from"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors.from ? true : undefined}
            aria-errormessage={
              actionData?.errors.from ? "from-error" : undefined
            }
            data-testid="new-trip-from-input"
            defaultValue={initialData?.from?.substring(0, 10)}
          />
        </label>
        {actionData?.errors.from && (
          <div className="pt-1 text-red-700" id="from=error">
            {actionData.errors.from}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Until: </span>
          <input
            ref={toRef}
            type="date"
            name="to"
            onChange={handleUntilDateChange}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors.to ? true : undefined}
            aria-errormessage={actionData?.errors.to ? "to-error" : undefined}
            data-testid="new-trip-to-input"
            defaultValue={initialData?.to?.substring(0, 10)}
          />
        </label>
        {actionData?.errors.to && (
          <div className="pt-1 text-red-700" id="to=error">
            {actionData.errors.to}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Destination: </span>
          <input
            ref={destinationRef}
            name="destination"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors.destination ? true : undefined}
            aria-errormessage={
              actionData?.errors.destination ? "destination-error" : undefined
            }
            defaultValue={initialData?.destination}
          />
        </label>
        {actionData?.errors.destination && (
          <div className="pt-1 text-red-700" id="destination=error">
            {actionData.errors.destination}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Country: </span>
          <input
            ref={countryRef}
            name="country"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors.country ? true : undefined}
            aria-errormessage={
              actionData?.errors.country ? "country-error" : undefined
            }
            defaultValue={initialData?.country}
          />
        </label>
        {actionData?.errors.country && (
          <div className="pt-1 text-red-700" id="country=error">
            {actionData.errors.country}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Copy location from previous trip: </span>
          <select
            name="usedOnClientOnlyPreviousTripCopyLocation"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 py-2 leading-loose"
            onChange={handleLocationCopy}
          >
            <option value="">Select a trip to copy from</option>
            {trips?.map((trip: TripClientResponse) => (
              <option key={trip.id} value={`${trip.lat};${trip.long}`}>
                {new Date(trip.from).toLocaleDateString()} - {trip.destination},{" "}
                {trip.country}
              </option>
            ))}
          </select>
        </label>
        {actionData?.errors.country && (
          <div className="pt-1 text-red-700" id="country=error">
            {actionData.errors.country}
          </div>
        )}
      </div>

      <div className="mt-2">
        <Map
          initialViewState={{
            longitude: 0,
            latitude: 0,
            zoom: 1,
          }}
          style={{ width: "100%", height: 400 }}
          mapStyle="mapbox://styles/mapbox/light-v10"
          mapboxAccessToken={data.mapboxToken}
          renderWorldCopies={false}
          onClick={setLocation}
        >
          <Marker
            longitude={long}
            latitude={lat}
            anchor="center"
            draggable={true}
            onDragEnd={setLocation}
          ></Marker>
        </Map>
        {actionData?.errors?.lat && (
          <div className="pt-1 text-red-700" id="lat=error">
            {actionData.errors.lat}
          </div>
        )}
        {actionData?.errors?.long && (
          <div className="pt-1 text-red-700" id="long=error">
            {actionData.errors.long}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors.description ? true : undefined}
            aria-errormessage={
              actionData?.errors.description ? "description-error" : undefined
            }
            defaultValue={initialData?.description}
          />
        </label>
        {actionData?.errors.description && (
          <div className="pt-1 text-red-700" id="description=error">
            {actionData.errors.description}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Flights: </span>
          <input
            ref={flightsRef}
            type="number"
            name="flights"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors.flights ? true : undefined}
            aria-errormessage={
              actionData?.errors.flights ? "flights-error" : undefined
            }
            defaultValue={initialData?.flights}
          />
        </label>
        {actionData?.errors.flights && (
          <div className="pt-1 text-red-700" id="flights=error">
            {actionData.errors.flights}
          </div>
        )}
      </div>

      <label className="my-4 flex w-full flex-row gap-1">
        <input
          type="checkbox"
          name="secret"
          defaultChecked={initialData?.secret || false}
        />
        <span>Private (no one else can see this!)</span>
      </label>

      {showHideUpcomingCheckbox && (
        <label className="mb-4 flex w-full flex-row gap-1">
          <input
            type="checkbox"
            name="hideUpcoming"
            defaultChecked={initialData?.hideUpcoming || false}
          />
          <span>Do not show on public profile until trip is over</span>
        </label>
      )}

      <input type="hidden" name="lat" value={lat} />
      <input type="hidden" name="long" value={long} />

      {isEdit && <input type="hidden" name="id" value={initialData?.id} />}

      {actionData?.errors.generic && (
        <div className="pt-1 text-red-700" id="generic=error">
          {actionData.errors.generic}
        </div>
      )}

      <button
        type="submit"
        className="rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-500 active:bg-slate-500"
        disabled={!!navigation.formData}
      >
        {navigation.formData ? (
          <div
            className="spinner-border inline-block h-4 w-4 animate-spin rounded-full border-2"
            role="status"
          ></div>
        ) : (
          "Save"
        )}
      </button>
    </Form>
  );
}
