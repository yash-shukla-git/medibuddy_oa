import { useEffect, useMemo, useState } from "react";
import MedicineCard from "./components/MedicineCard.jsx";
import MedicineDetail from "./components/MedicineDetail.jsx";

const API_URL = "https://api.fda.gov/drug/label.json";

function makeMedicineId(medicine, index) {
  const openfda = medicine.openfda ?? {};
  const parts = [
    openfda.brand_name?.[0],
    openfda.generic_name?.[0],
    openfda.manufacturer_name?.[0],
    medicine.id,
    medicine.set_id,
    index,
  ];

  return parts
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function searchMedicines(query, signal) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const url = new URL(API_URL);
  url.searchParams.set("search", `openfda.brand_name:"${trimmedQuery}"`);
  url.searchParams.set("limit", "20");

  const response = await fetch(url, { signal });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("The medicine search service is unavailable right now.");
  }

  const data = await response.json();

  return (data.results ?? []).map((medicine, index) => ({
    ...medicine,
    clientId: makeMedicineId(medicine, index),
  }));
}

function getInitialState() {
  const params = new URLSearchParams(window.location.search);

  return {
    query: params.get("q") ?? "",
    selectedId: params.get("medicine") ?? "",
  };
}

export default function App() {
  const initialState = useMemo(getInitialState, []);
  const [query, setQuery] = useState(initialState.query);
  const [submittedQuery, setSubmittedQuery] = useState(initialState.query);
  const [selectedId, setSelectedId] = useState(initialState.selectedId);
  const [medicines, setMedicines] = useState([]);
  const [status, setStatus] = useState(initialState.query ? "loading" : "idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();

    if (submittedQuery) {
      params.set("q", submittedQuery);
    }

    if (selectedId) {
      params.set("medicine", selectedId);
    }

    const nextUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState(null, "", nextUrl);
  }, [submittedQuery, selectedId]);

  useEffect(() => {
    if (!submittedQuery) {
      setMedicines([]);
      setSelectedId("");
      setStatus("idle");
      setError("");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");
    setError("");

    searchMedicines(submittedQuery, controller.signal)
      .then((results) => {
        setMedicines(results);
        setStatus(results.length ? "success" : "empty");
      })
      .catch((searchError) => {
        if (searchError.name === "AbortError") {
          return;
        }

        setMedicines([]);
        setSelectedId("");
        setStatus("error");
        setError(searchError.message);
      });

    return () => controller.abort();
  }, [submittedQuery]);

  const selectedMedicine = medicines.find((medicine) => medicine.clientId === selectedId);

  function handleSearch(event) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
    setSelectedId("");
  }

  function handleReset() {
    setQuery("");
    setSubmittedQuery("");
    setSelectedId("");
  }

  return (
    <main className="app-shell">
      <section className="search-panel" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">openFDA medicine labels</p>
          <h1 id="page-title">Medibuddy Medicine Search</h1>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <label htmlFor="medicine-search">Brand name</label>
          <div className="search-row">
            <input
              id="medicine-search"
              type="search"
              value={query}
              placeholder="Search Advil, Tylenol, Lipitor..."
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </section>

      {selectedId ? (
        <MedicineDetail
          medicine={selectedMedicine}
          loading={status === "loading"}
          onBack={() => setSelectedId("")}
        />
      ) : (
        <section className="results-section" aria-live="polite">
          <div className="results-heading">
            <h2>Results</h2>
            {submittedQuery ? (
              <button className="text-button" type="button" onClick={handleReset}>
                Clear
              </button>
            ) : null}
          </div>

          {status === "idle" ? (
            <p className="state-message">Enter a medicine brand name to search openFDA labels.</p>
          ) : null}

          {status === "loading" ? <p className="state-message">Searching medicines...</p> : null}

          {status === "error" ? <p className="state-message error">{error}</p> : null}

          {status === "empty" ? (
            <p className="state-message">No results found for "{submittedQuery}".</p>
          ) : null}

          {status === "success" ? (
            <div className="results-grid">
              {medicines.map((medicine) => (
                <MedicineCard
                  key={medicine.clientId}
                  medicine={medicine}
                  onSelect={() => setSelectedId(medicine.clientId)}
                />
              ))}
            </div>
          ) : null}
        </section>
      )}
    </main>
  );
}
