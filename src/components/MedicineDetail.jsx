import { getFirstValue, joinValues, sectionValue } from "../medicineUtils.js";

const DETAIL_FIELDS = [
  ["Purpose", "purpose"],
  ["Indications and usage", "indications_and_usage"],
  ["Dosage and administration", "dosage_and_administration"],
  ["Warnings", "warnings"],
  ["Active ingredient", "active_ingredient"],
  ["Inactive ingredient", "inactive_ingredient"],
  ["Do not use", "do_not_use"],
  ["Ask doctor", "ask_doctor"],
  ["Stop use", "stop_use"],
];

export default function MedicineDetail({ medicine, loading, onBack }) {
  if (loading) {
    return (
      <section className="detail-section">
        <button className="text-button" type="button" onClick={onBack}>
          Back to results
        </button>
        <p className="state-message">Loading medicine details...</p>
      </section>
    );
  }

  if (!medicine) {
    return (
      <section className="detail-section">
        <button className="text-button" type="button" onClick={onBack}>
          Back to results
        </button>
        <p className="state-message">
          This detail link could not be matched. Search again or choose another result.
        </p>
      </section>
    );
  }

  const openfda = medicine.openfda ?? {};

  return (
    <section className="detail-section">
      <button className="text-button" type="button" onClick={onBack}>
        Back to results
      </button>

      <div className="detail-header">
        <p className="eyebrow">{getFirstValue(openfda.product_type, "Medicine label")}</p>
        <h2>{getFirstValue(openfda.brand_name, "Unknown brand")}</h2>
        <p>{getFirstValue(openfda.generic_name, "Generic name unavailable")}</p>
      </div>

      <dl className="detail-summary">
        <div>
          <dt>Manufacturer</dt>
          <dd>{joinValues(openfda.manufacturer_name, "Unavailable")}</dd>
        </div>
        <div>
          <dt>Route</dt>
          <dd>{joinValues(openfda.route, "Unavailable")}</dd>
        </div>
        <div>
          <dt>Substance</dt>
          <dd>{joinValues(openfda.substance_name, "Unavailable")}</dd>
        </div>
        <div>
          <dt>Application number</dt>
          <dd>{joinValues(openfda.application_number, "Unavailable")}</dd>
        </div>
      </dl>

      <div className="detail-content">
        {DETAIL_FIELDS.map(([label, key]) => {
          const value = sectionValue(medicine[key]);

          if (!value) {
            return null;
          }

          return (
            <section key={key} className="label-section">
              <h3>{label}</h3>
              <p>{value}</p>
            </section>
          );
        })}
      </div>
    </section>
  );
}
