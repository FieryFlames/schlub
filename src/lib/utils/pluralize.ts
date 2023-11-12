const pluralRules = new Intl.PluralRules('en-US');

export default function pluralize(count: number, singular: string, plural: string): string {
  const grammaticalNumber = pluralRules.select(count);
  switch (grammaticalNumber) {
    case 'one':
      return count.toLocaleString() + ' ' + singular;
    default:
      return count.toLocaleString() + ' ' + plural;
  }
}
