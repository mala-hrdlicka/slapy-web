import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'mala-hrdlicka',
      name: 'slapy-web',
    },
  },

  // ZDE PŘIDÁVÁME SINGLETON PRO CENÍK
  singletons: {
    cenik: singleton({
      label: 'Ceník a Služby',
      path: 'src/content/cenik/',
      format: { data: 'json' },
      schema: {
        // 1. Týdenní pobyty
        tydenniPobyty: fields.array(
          fields.object({
            nazev: fields.text({ label: 'Název ubytování' }),
            popis: fields.text({ label: 'Krátký popis' }),
            sezona1: fields.text({ label: 'Cena - Hlavní sezóna' }),
            sezona2: fields.text({ label: 'Cena - Vedlejší sezóna' }),
            sezona3: fields.text({ label: 'Cena - Mimo sezónu' }),
            nejzadanejsi: fields.checkbox({ label: 'Zvýraznit jako "Nejžádanější"', defaultValue: false }),
          }),
          { label: 'Týdenní pobyty', itemLabel: (props) => props.fields.nazev.value },
        ),

        // 2. Víkendové pobyty
        vikendovePobyty: fields.array(
          fields.object({
            nazev: fields.text({ label: 'Název' }),
            cena: fields.text({ label: 'Cena' }),
            doba: fields.text({ label: 'Doba pobytu (např. Pátek - Neděle)' }),
            podminka: fields.text({ label: 'Podmínka (např. Pouze vedlejší sezóna)' }),
            ikona: fields.select({
              label: 'Ikona',
              options: [
                { label: 'Domeček', value: 'home' },
                { label: 'Osoby', value: 'users' },
                { label: 'Hvězda', value: 'star' },
              ],
              defaultValue: 'home',
            }),
          }),
          { label: 'Víkendové pobyty', itemLabel: (props) => props.fields.nazev.value },
        ),

        // 3. Doplňkové služby
        doplnkoveSluzby: fields.array(
          fields.object({
            nazev: fields.text({ label: 'Název služby' }),
            cena: fields.text({ label: 'Cena' }),
            jednotka: fields.text({ label: 'Jednotka (např. osoba/noc)' }),
            popis: fields.text({ label: 'Popis' }),
            highlight: fields.checkbox({ label: 'Zvýraznit (např. Sleva)', defaultValue: false }),
            ikona: fields.select({
              label: 'Ikona',
              options: [
                { label: 'Osoby', value: 'users' },
                { label: 'Srdce/Pes', value: 'heart' },
                { label: 'Blesk/Akce', value: 'bolt' },
                { label: 'Hvězda', value: 'star' },
              ],
              defaultValue: 'star',
            }),
          }),
          { label: 'Doplňkové služby', itemLabel: (props) => props.fields.nazev.value },
        ),

        // 4. Stornopodmínky
        stornopodminky: fields.array(
          fields.object({
            dny: fields.text({ label: 'Počet dnů (např. 31 - 45 dnů)' }),
            procenta: fields.text({ label: 'Procenta (např. 30 %)' }),
            popis: fields.text({ label: 'Popis (např. Ze zaplacené zálohy)' }),
          }),
          { label: 'Stornopodmínky', itemLabel: (props) => props.fields.dny.value },
        ),
      },
    }),
  },

  ui: {
    brand: {
      name: 'Malá Hrdlička | Administrace',
    },
    navigation: {
      // Tímto říkáme Keystaticu, jaké sekce chceme mít v levém menu
      'OBSAH WEBU': ['cenik'], // Sem patří náš nový singleton
      FOTOGALERIE: ['gallery'],
    },
  },

  collections: {
    gallery: collection({
      label: 'Správa sekcí galerie',
      slugField: 'title',
      path: 'src/content/gallery/*',
      format: { data: 'json' },

      schema: {
        title: fields.slug({
          name: {
            label: 'Název sekce',
            description: 'Zadejte název, který se zobrazí na webu (např. Apartmány, Chatky).',
          },
        }),

        // 1. PŘIDÁNO: Číselné pole pro pořadí
        order: fields.integer({
          label: 'Pořadí sekce na webu',
          description: 'Napište číslo (např. 1, 2, 3...). Podle tohoto čísla se sekce seřadí na webu.',
          defaultValue: 1,
          validation: { min: 1 }, // TÍMTO ZAKÁŽEME NULU A MÍNUSOVÁ ČÍSLA
        }),

        images: fields.array(
          fields.object({
            image: fields.image({
              label: 'Vybrat fotografii',
              directory: 'src/assets/images/gallery',
              publicPath: '../../assets/images/gallery/',
              validation: { isRequired: true },
            }),
            alt: fields.text({
              label: 'Popis fotografie',
              description: 'Krátce popište, co je na fotce (např. Pohled na ložnici). Pomáhá to lidem se zrakovým postižením a vyhledávačům.',
              defaultValue: 'Fotografie ubytování',
            }),
          }),
          {
            label: 'Seznam fotografií v této sekci',
            itemLabel: (props) => props.fields.alt.value || 'Nová fotografie',
            description: 'Zde můžete přidávat, odebírat nebo měnit pořadí fotek v této sekci.',
          },
        ),
      },
    }),
  },
});
