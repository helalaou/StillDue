import {it,expect} from 'vitest';import {escapeHtml,emailLayout} from '../netlify/lib/email';
it('renders user text as content rather than email markup',()=>{expect(escapeHtml('<img src=x onerror="bad">')).toBe('&lt;img src=x onerror=&quot;bad&quot;&gt;');expect(emailLayout('<script>bad</script>','<p>Safe content</p>')).not.toContain('<script>')});
