import { getFirstValue, joinValues } from "../medicineUtils.js";

export default function MedicineCard({ medicine, onSelect }) {
  const openfda = medicine.openfda ?? {};
  const brandName = getFirstValue(openfda.brand_name, "Unknown brand");
  const genericName = getFirstValue(openfda.generic_name, "Generic name unavailable");
  const manufacturer = getFirstValue(openfda.manufacturer_name, "Manufacturer unavailable");
  const productType = getFirstValue(openfda.product_type, "Product type unavailable");
  const routes = joinValues(openfda.route, "Route unavailable");

  return (
    <article className="medicine-card">
      <div>
        <h3>{brandName}</h3>
        <p>{genericName}</p>
      </div>

      <dl>
        <div>
          <dt>Manufacturer</dt>
          <dd>{manufacturer}</dd>
        </div>
        <div>
          <dt>Product type</dt>
          <dd>{productType}</dd>
        </div>
        <div>
          <dt>Route</dt>
          <dd>{routes}</dd>
        </div>
      </dl>

      <button type="button" onClick={onSelect}>
        View details
      </button>
    </article>
  );
}
