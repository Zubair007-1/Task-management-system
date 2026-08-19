/**
 * Export an array of objects as a CSV file download.
 * @param {Object[]} data - Array of flat objects
 * @param {string} filename - Output filename (without extension)
 */
export function exportCsv(data, filename = 'export') {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((key) => {
        const val = row[key] ?? '';
        // Escape commas and quotes
        const str = String(val).replace(/"/g, '""');
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str}"`
          : str;
      })
      .join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse a CSV string into an array of objects.
 * @param {string} text - Raw CSV content
 * @returns {Object[]}
 */
export function parseCsv(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    return headers.reduce((obj, key, i) => {
      obj[key] = values[i] ?? '';
      return obj;
    }, {});
  });
}
