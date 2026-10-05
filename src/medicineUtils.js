export function getFirstValue(value, fallback) {
  if (Array.isArray(value)) {
    return value.find(Boolean) ?? fallback;
  }

  return value || fallback;
}

export function joinValues(value, fallback) {
  if (Array.isArray(value)) {
    const joined = value.filter(Boolean).join(", ");
    return joined || fallback;
  }

  return value || fallback;
}

export function sectionValue(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join("\n\n");
  }

  return value ?? "";
}
