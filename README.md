# Dungeon Coursers Breeding Calculator

A simple web app to generate foal possibilities from two parent Dungeon Courser horses, with advanced breeding search capabilities.

## Features

### Core Breeding
- Generate 4 different foal possibilities from two parents
- Validates temperament compatibility (parents must have different temperaments)
- Handles complex gene inheritance including:
  - Base coat colors (E/A locus)
  - Dilutions (Cream, Tapestry, Pearl, Champagne, Ether)
  - White markings (Tobiano, Overo, Leopard complex, etc.)
  - Modifiers (Dun, Gray, Gilt, Prism, etc.)
  - Anomalies (25% inheritance + 5% random)
  - Variants (Heraldic, Puck, Cavedweller)
- Calculates rarity scores for each foal

### NEW: Collection Management & Smart Search
- **Upload your horse collection** as a CSV file
- **Ask breeding questions** in natural language:
  - "How can I make Amber Champagne?"
  - "Who can breed for fewspot and starfield?"
  - "Which pairs can produce ether?"
- **Smart matching algorithm** finds the best breeding pairs from your collection
- **One-click pairing** - click "Use This Pair" to automatically fill in parents
- **Probability estimates** for each breeding match

## Usage

### Basic Breeding
1. Paste the genotype for Parent 1 (e.g., `Ee Aa nCr nT + Brindle`)
2. Select the temperament for Parent 1
3. (Optional) Select variant for Parent 1
4. Repeat for Parent 2
5. Click "Generate Foal Possibilities"
6. View 4 different possible foal outcomes!

### Advanced: Collection Search
1. **Prepare your CSV**: Create a CSV file with columns:
   - `ID` - Horse ID number
   - `Name` - Horse name
   - `Genotype` - Full genotype string
   - `Temperament` - Choleric, Melancholic, Phlegmatic, or Sanguine
   - `Variant` - Standard, Heraldic, Puck, or Cavedweller

2. **Upload**: Click "Choose File" and upload your CSV

3. **Search**: Type a breeding question like:
   - "How can I make fewspot?"
   - "Who can breed for starfield and gilt?"
   - "Which pairs produce cream pearl ether?"

4. **Review Results**: See matched breeding pairs ranked by compatibility

5. **Use Pair**: Click "Use This Pair" on any result to auto-fill the breeding form

## CSV Format Example

```csv
ID,Name,Genotype,Temperament,Variant
3108,Soup,EE aa Tpprl nO LpLp patnpatn + Geode,Melancholic,Heraldic
3542,Pwnco,Ee aa erer nSh nG nOs nD + Oracle,Sanguine,Standard
```

See `sample_horses.csv` for a complete example.

## Supported Search Queries

The calculator recognizes these traits:
- **Coat Colors**: Amber Champagne, Gold Champagne, Classic Champagne, Cream, Pearl, Cream Pearl, Tapestry, Ether, Perlino, Buckskin
- **White Markings**: Leopard Complex (Fewspot, Snowcap, Varnish Roan, Leopard, Blanket, Snowflake), Tobiano, Overo, Splash, Roan, Sabino, Shroud, Ossuary, Filigree, Harlequin
- **Modifiers**: Starfield, Gilt, Tabard, Opal, Prism, Gray, Dun, Illuminated, Sepulchered

## Example Genotypes

**Simple:**
```
Ee Aa nT + Lantern
```

**Complex:**
```
EE aa Tpprl nO LpLp patnpatn + Geode
```

## Notes

- Parents must have **different Temperaments** to breed
- Each foal is randomly generated based on genetic inheritance rules
- Anomalies have a 25% chance to pass from parents + 5% random chance
- Variants have a 25% chance to pass from each parent
- Rarity scores are calculated based on legendary/epic/rare gene combinations
- Search results are ranked by genetic compatibility and probability

## Credits

Created for the [Dungeon Coursers](https://dungeon-coursers.com) HARPG community.

Free to use and modify!
