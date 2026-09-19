/**
 * Wykazy pomieszczen i rzuty kondygnacji, spisane z PDF-ow rzutow dewelopera
 * (SenseVR/Qupto, inwestycja 214) skryptem scripts/rzuty.py. Dwadziescia lokali ma
 * szesc typow rzutu, wiec dane trzymamy per typ, a nie per lokal.
 *
 * Suma pomieszczen kazdego typu zgadza sie co do setnej z metrazem z units.ts.
 * W typach 3A i 3B pierwsza pozycja parteru to garaz - jest w metrazu lokalu,
 * dlatego strona pokazuje obok powierzchnie bez garazu (livingArea w unitType.ts).
 *
 * Poddasza tu nie ma: deweloper nie rysuje go na zadnym rzucie, mimo ze jest w cenie.
 */
type Pomieszczenie = { nazwa: string; m2: number };
export type Kondygnacja = {
  nazwa: "Parter" | "Piętro";
  pomieszczenia: Pomieszczenie[];
  suma: number;
};

export const RZUTY: Record<string, Kondygnacja[]> = {
  "1A": [
    {
      "nazwa": "Parter",
      "pomieszczenia": [
        {
          "nazwa": "hol",
          "m2": 5.4
        },
        {
          "nazwa": "pomieszczenie gospodarcze",
          "m2": 1.5
        },
        {
          "nazwa": "wc",
          "m2": 1.6
        },
        {
          "nazwa": "salon z aneksem kuchennym",
          "m2": 37.63
        },
        {
          "nazwa": "wnęka kuchenna",
          "m2": 1.11
        },
        {
          "nazwa": "schody",
          "m2": 4.15
        }
      ],
      "suma": 51.39
    },
    {
      "nazwa": "Piętro",
      "pomieszczenia": [
        {
          "nazwa": "korytarz",
          "m2": 5.68
        },
        {
          "nazwa": "łazienka",
          "m2": 4.06
        },
        {
          "nazwa": "sypialnia",
          "m2": 9.58
        },
        {
          "nazwa": "pokój 1",
          "m2": 13
        },
        {
          "nazwa": "pokój 2",
          "m2": 10.71
        }
      ],
      "suma": 43.03
    }
  ],
  "1B": [
    {
      "nazwa": "Parter",
      "pomieszczenia": [
        {
          "nazwa": "wiatrołap",
          "m2": 3.74
        },
        {
          "nazwa": "hol",
          "m2": 1.28
        },
        {
          "nazwa": "wc",
          "m2": 1.7
        },
        {
          "nazwa": "pomieszczenie techniczne",
          "m2": 1.25
        },
        {
          "nazwa": "salon z aneksem kuchennym",
          "m2": 29.79
        },
        {
          "nazwa": "schody",
          "m2": 4.98
        }
      ],
      "suma": 42.74
    },
    {
      "nazwa": "Piętro",
      "pomieszczenia": [
        {
          "nazwa": "korytarz",
          "m2": 4.32
        },
        {
          "nazwa": "łazienka",
          "m2": 4.9
        },
        {
          "nazwa": "pralnia",
          "m2": 10.62
        },
        {
          "nazwa": "garderoba",
          "m2": 13.05
        },
        {
          "nazwa": "sypialnia",
          "m2": 10.31
        }
      ],
      "suma": 43.2
    }
  ],
  "2A": [
    {
      "nazwa": "Parter",
      "pomieszczenia": [
        {
          "nazwa": "hol",
          "m2": 5.4
        },
        {
          "nazwa": "pomieszczenie gospodarcze",
          "m2": 1.5
        },
        {
          "nazwa": "wc",
          "m2": 1.6
        },
        {
          "nazwa": "salon z aneksem kuchennym",
          "m2": 37.63
        },
        {
          "nazwa": "wnęka kuchenna",
          "m2": 1.11
        },
        {
          "nazwa": "schody",
          "m2": 4.15
        }
      ],
      "suma": 51.39
    },
    {
      "nazwa": "Piętro",
      "pomieszczenia": [
        {
          "nazwa": "korytarz",
          "m2": 5.68
        },
        {
          "nazwa": "łazienka",
          "m2": 4.06
        },
        {
          "nazwa": "sypialnia",
          "m2": 9.84
        },
        {
          "nazwa": "pokój 1",
          "m2": 12.14
        },
        {
          "nazwa": "pokój 2",
          "m2": 9.63
        }
      ],
      "suma": 41.35
    }
  ],
  "2B": [
    {
      "nazwa": "Parter",
      "pomieszczenia": [
        {
          "nazwa": "wiatrołap",
          "m2": 3.74
        },
        {
          "nazwa": "hol",
          "m2": 1.28
        },
        {
          "nazwa": "wc",
          "m2": 1.7
        },
        {
          "nazwa": "pomieszczenie techniczne",
          "m2": 1.25
        },
        {
          "nazwa": "salon z aneksem kuchennym",
          "m2": 29.79
        },
        {
          "nazwa": "schody",
          "m2": 4.98
        }
      ],
      "suma": 42.74
    },
    {
      "nazwa": "Piętro",
      "pomieszczenia": [
        {
          "nazwa": "korytarz",
          "m2": 4.32
        },
        {
          "nazwa": "łazienka",
          "m2": 4.9
        },
        {
          "nazwa": "pralnia",
          "m2": 8.76
        },
        {
          "nazwa": "garderoba",
          "m2": 10.62
        },
        {
          "nazwa": "sypialnia",
          "m2": 10.71
        }
      ],
      "suma": 39.31
    }
  ],
  "3A": [
    {
      "nazwa": "Parter",
      "pomieszczenia": [
        {
          "nazwa": "garaż",
          "m2": 17.61
        },
        {
          "nazwa": "wiatrołap",
          "m2": 4.5
        },
        {
          "nazwa": "komunikacja",
          "m2": 4.27
        },
        {
          "nazwa": "łazienka",
          "m2": 3.6
        },
        {
          "nazwa": "wnęka kuchenna",
          "m2": 1.74
        },
        {
          "nazwa": "salon z aneksem kuchennym",
          "m2": 33.67
        },
        {
          "nazwa": "schody",
          "m2": 4.34
        }
      ],
      "suma": 69.73
    },
    {
      "nazwa": "Piętro",
      "pomieszczenia": [
        {
          "nazwa": "korytarz",
          "m2": 4.16
        },
        {
          "nazwa": "sypialnia",
          "m2": 14.09
        },
        {
          "nazwa": "pokój 1",
          "m2": 12.12
        },
        {
          "nazwa": "łazienka",
          "m2": 4.42
        },
        {
          "nazwa": "pralnia",
          "m2": 12.99
        },
        {
          "nazwa": "garderoba",
          "m2": 15.52
        }
      ],
      "suma": 63.3
    }
  ],
  "3B": [
    {
      "nazwa": "Parter",
      "pomieszczenia": [
        {
          "nazwa": "garaż",
          "m2": 17.61
        },
        {
          "nazwa": "wiatrołap",
          "m2": 4.5
        },
        {
          "nazwa": "komunikacja",
          "m2": 4.27
        },
        {
          "nazwa": "łazienka",
          "m2": 3.6
        },
        {
          "nazwa": "wnęka kuchenna",
          "m2": 1.74
        },
        {
          "nazwa": "salon z aneksem kuchennym",
          "m2": 33.67
        },
        {
          "nazwa": "schody",
          "m2": 4.34
        }
      ],
      "suma": 69.73
    },
    {
      "nazwa": "Piętro",
      "pomieszczenia": [
        {
          "nazwa": "korytarz",
          "m2": 4.16
        },
        {
          "nazwa": "sypialnia",
          "m2": 13.1
        },
        {
          "nazwa": "pokój 1",
          "m2": 11.47
        },
        {
          "nazwa": "łazienka",
          "m2": 4.42
        },
        {
          "nazwa": "pralnia",
          "m2": 11.3
        },
        {
          "nazwa": "garderoba",
          "m2": 13.1
        }
      ],
      "suma": 57.55
    }
  ]
};
