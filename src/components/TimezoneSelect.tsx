import { useId, useMemo } from 'react';

const commonZones = [
  'UTC',
  'AoE',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Africa/Casablanca',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
];

function supportedZones() {
  try {
    return (
      (
        Intl as typeof Intl & {
          supportedValuesOf?: (key: 'timeZone') => string[];
        }
      ).supportedValuesOf?.('timeZone') ?? []
    );
  } catch {
    return [];
  }
}

function zoneLabel(zone: string) {
  if (zone === 'UTC') return 'UTC · Coordinated Universal Time';
  if (zone === 'AoE') return 'AoE · Anywhere on Earth (UTC−12)';
  const [region, ...place] = zone.split('/');
  return `${place.join(' / ').replaceAll('_', ' ')} · ${region}`;
}

export function TimezoneSelect({
  value,
  onChange,
  label = 'Timezone',
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const id = useId();
  const zones = useMemo(() => {
    const supported = supportedZones();
    const known = new Set([...commonZones, ...supported]);
    const regions = new Map<string, string[]>();
    for (const zone of supported.filter((zone) => !commonZones.includes(zone))) {
      const region = zone.split('/')[0] || 'Other';
      const list = regions.get(region) ?? [];
      list.push(zone);
      regions.set(region, list);
    }
    return {
      currentOnly: value && !known.has(value) ? value : null,
      regions: [...regions.entries()].sort(([a], [b]) => a.localeCompare(b)),
    };
  }, [value]);

  return (
    <label className="field timezone-select-field" htmlFor={id}>
      {label}
      <select
        id={id}
        data-testid="timezone-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {zones.currentOnly && <option value={zones.currentOnly}>{zones.currentOnly}</option>}
        <optgroup label="Common timezones">
          {commonZones.map((zone) => (
            <option value={zone} key={zone}>
              {zoneLabel(zone)}
            </option>
          ))}
        </optgroup>
        {zones.regions.map(([region, regionZones]) => (
          <optgroup label={region} key={region}>
            {regionZones.map((zone) => (
              <option value={zone} key={zone}>
                {zoneLabel(zone)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <small>Choose by city or region. AoE is the research-deadline UTC−12 convention.</small>
    </label>
  );
}
