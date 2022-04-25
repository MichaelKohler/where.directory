import * as React from "react";
import Map, { Marker } from "react-map-gl";
import type { MapLayerMouseEvent, MarkerDragEvent } from "react-map-gl";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import Alert from "@reach/alert";

import type { TripClientResponse } from "~/models/trip.server";

export type LoaderData = {
  mapboxToken: string;
};

export type ActionData = {
  errors?: {
    generic?: string;
    destination?: string;
    country?: string;
    description?: string;
    flights?: string;
    lat?: string;
    long?: string;
    from?: string;
    to?: string;
  };
};

export default function TripForm({
  initialData,
}: {
  initialData?: TripClientResponse;
}) {
  const actionData = useActionData() as ActionData;
  const data = useLoaderData() as LoaderData;
  const transition = useTransition();
  const [lat, setLatitude] = React.useState<number>(0);
  const [long, setLongitude] = React.useState<number>(0);
  const [showHideUpcomingCheckbox, setShowHideUpcomingCheckbox] =
    React.useState(initialData?.hideUpcoming || false);

  const fromRef = React.useRef<HTMLInputElement>(null);
  const toRef = React.useRef<HTMLInputElement>(null);
  const destinationRef = React.useRef<HTMLInputElement>(null);
  const countryRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const flightsRef = React.useRef<HTMLInputElement>(null);

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

  const isEdit = !!initialData?.id;

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
            aria-invalid={actionData?.errors?.from ? true : undefined}
            aria-errormessage={
              actionData?.errors?.from ? "from-error" : undefined
            }
            data-testid="new-trip-from-input"
            defaultValue={initialData?.from?.substring(0, 10)}
          />
        </label>
        {actionData?.errors?.from && (
          <Alert className="pt-1 text-red-700" id="from=error">
            {actionData.errors.from}
          </Alert>
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
            aria-invalid={actionData?.errors?.to ? true : undefined}
            aria-errormessage={actionData?.errors?.to ? "to-error" : undefined}
            data-testid="new-trip-to-input"
            defaultValue={initialData?.to?.substring(0, 10)}
          />
        </label>
        {actionData?.errors?.to && (
          <Alert className="pt-1 text-red-700" id="to=error">
            {actionData.errors.to}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Destination: </span>
          <input
            ref={destinationRef}
            name="destination"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.destination ? true : undefined}
            aria-errormessage={
              actionData?.errors?.destination ? "destination-error" : undefined
            }
            defaultValue={initialData?.destination}
          />
        </label>
        {actionData?.errors?.destination && (
          <Alert className="pt-1 text-red-700" id="destination=error">
            {actionData.errors.destination}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Country: </span>
          <input
            ref={countryRef}
            name="country"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.country ? true : undefined}
            aria-errormessage={
              actionData?.errors?.country ? "country-error" : undefined
            }
            defaultValue={initialData?.country}
          />
        </label>
        {actionData?.errors?.country && (
          <Alert className="pt-1 text-red-700" id="country=error">
            {actionData.errors.country}
          </Alert>
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
          <Alert className="pt-1 text-red-700" id="lat=error">
            {actionData.errors.lat}
          </Alert>
        )}
        {actionData?.errors?.long && (
          <Alert className="pt-1 text-red-700" id="long=error">
            {actionData.errors.long}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={
              actionData?.errors?.description ? "description-error" : undefined
            }
            defaultValue={initialData?.description}
          />
        </label>
        {actionData?.errors?.description && (
          <Alert className="pt-1 text-red-700" id="description=error">
            {actionData.errors.description}
          </Alert>
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
            aria-invalid={actionData?.errors?.flights ? true : undefined}
            aria-errormessage={
              actionData?.errors?.flights ? "flights-error" : undefined
            }
            defaultValue={initialData?.flights}
          />
        </label>
        {actionData?.errors?.flights && (
          <Alert className="pt-1 text-red-700" id="flights=error">
            {actionData.errors.flights}
          </Alert>
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

      {actionData?.errors?.generic && (
        <Alert className="pt-1 text-red-700" id="generic=error">
          {actionData.errors.generic}
        </Alert>
      )}

      <button
        type="submit"
        className="rounded bg-slate-600 py-2 px-4 text-white hover:bg-slate-500 active:bg-slate-500"
        disabled={!!transition.submission}
      >
        {transition.submission ? (
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
