# Refactor: mniej strony, ta sama treść

Strona miała sześć reprezentacji tych samych dwudziestu lokali i cztery wejścia w ofertę.
Poniżej wszystko, co zniknęło z widoku, i miejsce, w którym ta sama informacja została.
Dane lokali (ceny, metraże, ogrody, statusy, liczba pokoi), dane rejestrowe, adresy i treści
prawne nie zmieniły się o znak.

## Co zniknęło i gdzie to jest

| usunięta informacja | gdzie ta sama informacja zostaje |
| --- | --- |
| pozycja menu "Osiedle" | sekcja Mieszkania i domy: plan osiedla z numerami budynków |
| pozycja menu "Cennik" | ta sama tabela, teraz w sekcji Mieszkania i domy |
| pozycja menu "Spacer 360" | sekcja spaceru zostaje na stronie, w kolejności pod ofertą |
| sekcja Osiedle: sześć kart grup budynków (kadr, liczba lokali, metraże, wolne, cena od) | plan osiedla w sekcji Mieszkania i domy (budynki, lokale, statusy) oraz kolumny Budynek, Powierzchnia, Cena i Status w zestawieniu |
| akapit "Osiedle to 16 mieszkań i 4 domy w 10 budynkach..." | lead sekcji Mieszkania i domy, skrócony do dwóch zdań |
| sekcja Cennik jako osobna sekcja | ta sama tabela, ten sam komplet 20 lokali, teraz w sekcji Mieszkania i domy |
| siatka kart lokali z rzutem parteru (6 + "Pokaż wszystkie") | wiersze zestawienia z tymi samymi danymi; rzut parteru i piętra na podstronie lokalu |
| okno lokalu (modal z rzutami i ceną) | podstrona lokalu: te same rzuty, cena, parametry, CTA |
| filtr budynków (7 chipów) | plan osiedla: klik w lokal prowadzi do jego wiersza w zestawieniu |
| sortowanie "Cena malejąco" i "Metraż od najmniejszego" | zostają "Cena rosnąco" i "Metraż malejąco"; kolumny w tabeli pokazują komplet danych |
| przycisk "Zapytaj" w każdym wierszu cennika i na kartach | CTA "Zapytaj o..." na podstronie lokalu, z prefillem formularza |
| liczniki "mieszkań dostępnych" i "domów dostępnych" osobno | pasek statystyk: dostępnych / wszystkich / cena od, plus kolumna Status przy każdym lokalu |

## Wykryte poza zakresem

- `components/Contact.tsx`: reguła `react-hooks/set-state-in-effect` zgłasza błąd przy odczycie
  `?lokal=` z adresu. Błąd jest starszy niż ten refactor, a naprawa wymaga zmiany sposobu
  prefillu (ryzyko rozjazdu hydracji), więc zostaje na osobne zadanie.
- `scripts/osiedle-kadry.mjs` generuje kadry budynków (`public/osiedle/b*.webp`), których po
  usunięciu sekcji Osiedle nikt nie renderuje. Pliki i skrypt zostają w repozytorium zgodnie
  z ustaleniem, że kasujemy render, nie assety.
