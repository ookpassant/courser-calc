// Dungeon Coursers Breeding Calculator
// Gene inheritance logic

// Store user's horse collection
let horseCollection = [];

// CSV Upload Handler
document.addEventListener('DOMContentLoaded', function() {
    const csvInput = document.getElementById('csvUpload');
    if (csvInput) {
        csvInput.addEventListener('change', handleCSVUpload);
    }
});

function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        parseCSV(text);
    };
    reader.readAsText(file);
}

function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    horseCollection = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        const horse = {};
        
        headers.forEach((header, index) => {
            horse[header] = values[index] ? values[index].trim() : '';
        });
        
        if (horse.genotype && horse.temperament) {
            horseCollection.push({
                id: horse.id || horse.name || `Horse ${i}`,
                name: horse.name || `Horse ${i}`,
                genotype: horse.genotype,
                temperament: horse.temperament,
                variant: horse.variant || 'Standard'
            });
        }
    }
    
    document.getElementById('collectionStatus').style.display = 'block';
    document.getElementById('horseCount').textContent = horseCollection.length;
    
    console.log(`Loaded ${horseCollection.length} horses:`, horseCollection);
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    
    return result.map(val => val.replace(/^"|"$/g, ''));
}

// Trait phenotype names based on genes
const COAT_COLORS = {
    'EE_AA': 'Bay', 'Ee_AA': 'Bay', 'EE_Aa': 'Bay', 'Ee_Aa': 'Bay',
    'EE_aa': 'Black', 'Ee_aa': 'Black',
    'ee_AA': 'Chestnut', 'ee_Aa': 'Chestnut', 'ee_aa': 'Chestnut'
};

// Special coat color names for base + dilution combinations
const SPECIAL_COAT_NAMES = {
    // Single Cream dilutions
    'Bay_Cream': 'Buckskin',
    'Black_Cream': 'Smoky Black',
    'Chestnut_Cream': 'Palomino',

    // Double Cream dilutions
    'Bay_Double Cream': 'Perlino',
    'Black_Double Cream': 'Smoky Cream',
    'Chestnut_Double Cream': 'Cremello',

    // Single Tapestry dilutions
    'Bay_Tapestry': 'Madder',
    'Black_Tapestry': 'Woad',
    'Chestnut_Tapestry': 'Weld',

    // Pearl dilutions
    'Bay_Pearl': 'Bay Pearl',
    'Black_Pearl': 'Black Pearl',
    'Chestnut_Pearl': 'Gold Pearl',

    // Champagne dilutions
    'Bay_Champagne': 'Amber Champagne',
    'Black_Champagne': 'Classic Champagne',
    'Chestnut_Champagne': 'Gold Champagne',

    // Ether dilutions
    'Bay_Ether': 'Ombre Ether',
    'Black_Ether': 'Classic Ether',
    'Chestnut_Ether': 'Cold Ether',

    // Tapestry + Cream combinations
    'Bay_Tapestry Cream': 'Madder Buckskin',
    'Black_Tapestry Cream': 'Woad Smoky Black',
    'Chestnut_Tapestry Cream': 'Weld Palomino',

    // Tapestry Ether combinations
    'Bay_Tapestry Ether': 'Madder Ether',
    'Black_Tapestry Ether': 'Woad Ether',
    'Chestnut_Tapestry Ether': 'Weld Ether',

    // Pearl Ether combinations
    'Bay_Pearl Ether': 'Bay Pearl Ether',
    'Black_Pearl Ether': 'Black Pearl Ether',
    'Chestnut_Pearl Ether': 'Gold Pearl Ether',

    // Cream Pearl Champagne (triple dilution)
    'Bay_Cream Pearl Champagne': 'Amber Cream Pearl Champagne',
    'Black_Cream Pearl Champagne': 'Classic Cream Pearl Champagne',
    'Chestnut_Cream Pearl Champagne': 'Gold Cream Pearl Champagne',

    // Cream Pearl Ether (triple dilution)
    'Bay_Cream Pearl Ether': 'Ombre Cream Pearl Ether',
    'Black_Cream Pearl Ether': 'Classic Cream Pearl Ether',
    'Chestnut_Cream Pearl Ether': 'Cold Cream Pearl Ether',

    // Tapestry Cream Ether (triple dilution)
    'Bay_Tapestry Cream Ether': 'Madder Cream Ether',
    'Black_Tapestry Cream Ether': 'Woad Cream Ether',
    'Chestnut_Tapestry Cream Ether': 'Weld Cream Ether',

    // Tapestry Pearl (base double dilution)
    'Bay_Tapestry Pearl': 'Tyrian Pearl',
    'Black_Tapestry Pearl': 'Phthalo Pearl',
    'Chestnut_Tapestry Pearl': 'Ochre Pearl',

    // Tapestry Pearl Champagne (triple dilution)
    'Bay_Tapestry Pearl Champagne': 'Tyrian Pearl Champagne',
    'Black_Tapestry Pearl Champagne': 'Phthalo Pearl Champagne',
    'Chestnut_Tapestry Pearl Champagne': 'Ochre Pearl Champagne',

    // Tapestry Pearl Ether (triple dilution)
    'Bay_Tapestry Pearl Ether': 'Tyrian Pearl Ether',
    'Black_Tapestry Pearl Ether': 'Phthalo Pearl Ether',
    'Chestnut_Tapestry Pearl Ether': 'Ochre Pearl Ether',

    // Tapestry Cream Champagne (triple dilution)
    'Bay_Tapestry Cream Champagne': 'Madder Cream Champagne',
    'Black_Tapestry Cream Champagne': 'Woad Cream Champagne',
    'Chestnut_Tapestry Cream Champagne': 'Weld Cream Champagne'
};

const DILUTION_NAMES = {
    'nCr': 'Cream', 'Cr': 'Cream', 'CrCr': 'Double Cream',
    'nTp': 'Tapestry', 'Tp': 'Tapestry', 'TpTp': 'Tapestry',
    'nprl': 'Pearl', 'prl': 'Pearl', 'prlprl': 'Pearl',
    'nCh': 'Champagne', 'Ch': 'Champagne', 'ChCh': 'Champagne',
    'ner': 'Ether', 'er': 'Ether', 'erer': 'Ether',
    'Crprl': 'Cream Pearl', 'TpCr': 'Tapestry Cream',
    'Tpprl': 'Tapestry Pearl', 'CrCh': 'Cream Champagne',
    'prlCh': 'Pearl Champagne', 'TpCh': 'Tapestry Champagne',
    'Crer': 'Cream Ether', 'Tper': 'Tapestry Ether', 'prler': 'Pearl Ether',
    'CrprlCh': 'Cream Pearl Champagne', 'Crprler': 'Cream Pearl Ether',
    'TpCrer': 'Tapestry Cream Ether', 'TpprlCh': 'Tapestry Pearl Champagne',
    'Tpprler': 'Tapestry Pearl Ether', 'TpCrCh': 'Tapestry Cream Champagne'
};

const MODIFIER_NAMES = {
    'nD': 'Dun', 'DD': 'Dun',
    'nP': 'Pangare',
    'nSty': 'Sooty',
    'nG': 'Gray',
    'nf': 'Flaxen', 'ff': 'Flaxen',
    'nZ': 'Silver',
    'nLu': 'Illuminated',
    'nsp': 'Sepulchered', 'spsp': 'Sepulchered',
    'Lusp': 'Illuminated Sepulchered',
    'nTd': 'Tabard',
    'nGl': 'Gilt',
    'nV': 'Vellum',
    'nOp': 'Opal',
    'nPr': 'Prism',
    'PrOp': 'Prism Opal',
    'nsf': 'Starfield', 'sfsf': 'Starfield'
};

// Traits that appear BEFORE the coat color in phenotype display
const TRAITS_BEFORE_COAT = [
    'Dominant White', 'Crowned', 'Flaxen', 'Carrying Flaxen', 'Pangare',
    'Sooty', 'Gray', 'Silver', 'Illuminated', 'Gilt', 'Opal', 'Prism',
    'Starfield', 'Vellum'
];

// Traits that appear AFTER the coat color in phenotype display
const TRAITS_AFTER_COAT = [
    'Dun', 'Tabard', 'Cuirass', 'Sepulchered', 'Carrying Sepulchered',
    // White markings generally go after
    'Tobiano', 'Overo', 'Splash', 'Roan', 'Sabino', 'Blanket', 'Snowcap',
    'Varnish Roan', 'Leopard', 'Fewspot', 'Snowflake', 'Ossuary',
    'Shroud', 'Filigree', 'Harlequin', 'Rabicano', 'False Leopard',
    'Girdle', 'Collar', 'Blanched'
];

const WHITE_MARKING_NAMES = {
    'nSpl': 'Splash',
    'nR': 'Roan', 'RnT': 'Roan',
    'nT': 'Tobiano', 'TT': 'Tobiano',
    'nSf': 'Snowflake',
    'nCu': 'Cuirass', 'CuCw': 'Cuirass Crowned',
    'nCw': 'Crowned',
    'nO': 'Overo',
    'nB': 'Blanket',
    'nSb': 'Sabino',
    'nGi': 'Girdle',
    'nCo': 'Collar',
    'nBl': 'Blanched',
    'nW': 'Dominant White',
    'nRb': 'Rabicano',
    'nFl': 'False Leopard',
    'nHq': 'Harlequin',
    'nFs': 'Fewspot',
    'nSh': 'Shroud',
    'nfe': 'Filigree', 'fefe': 'Filigree',
    'nOs': 'Ossuary'
};

function parseGenotype(genoString) {
    const parts = genoString.trim().split('+');
    const genes = parts[0].trim().split(/\s+/);
    const anomalies = parts.length > 1 ? parts[1].trim().split(',').map(a => a.trim()) : [];

    return { genes, anomalies };
}

function genotypeToPhenotype(genoString) {
    const { genes, anomalies } = parseGenotype(genoString);

    let baseCoat = '';
    let dilutions = [];
    const allTraits = []; // Collect all traits with their category

    // Find base coat (E and A genes)
    const eGene = genes.find(g => g.match(/^[Ee][Ee]?$/));
    const aGene = genes.find(g => g.match(/^[Aa][Aa]?$/));

    if (eGene && aGene) {
        const key = `${eGene}_${aGene}`;
        baseCoat = COAT_COLORS[key] || 'Unknown';
    }

    // Find dilutions - check for complex combinations first
    const genoLower = genoString.toLowerCase();
    let foundDilution = false;

    // Check for triple dilutions first
    if (genoLower.includes('crprlch') || genoLower.includes('crchprl') || genoLower.includes('prlcrch')) {
        dilutions.push('Cream Pearl Champagne');
        foundDilution = true;
    } else if (genoLower.includes('crprler') || genoLower.includes('prlcrer')) {
        dilutions.push('Cream Pearl Ether');
        foundDilution = true;
    } else if (genoLower.includes('tpcrer') || genoLower.includes('tperCr')) {
        dilutions.push('Tapestry Cream Ether');
        foundDilution = true;
    } else if (genoLower.includes('tpprlch') || genoLower.includes('tpchprl')) {
        dilutions.push('Tapestry Pearl Champagne');
        foundDilution = true;
    } else if (genoLower.includes('tpprler') || genoLower.includes('tperprl')) {
        dilutions.push('Tapestry Pearl Ether');
        foundDilution = true;
    } else if (genoLower.includes('tpcrch') || genoLower.includes('tpchcr')) {
        dilutions.push('Tapestry Cream Champagne');
        foundDilution = true;
    }

    // Check for double dilutions if no triple found
    if (!foundDilution) {
        genes.forEach(gene => {
            if (DILUTION_NAMES[gene]) {
                dilutions.push(DILUTION_NAMES[gene]);
            }
        });
    }

    // Build special coat color name
    let coatColor = baseCoat;
    if (dilutions.length > 0) {
        const dilutionStr = dilutions.join(' ');
        const specialKey = `${baseCoat}_${dilutionStr}`;
        if (SPECIAL_COAT_NAMES[specialKey]) {
            coatColor = SPECIAL_COAT_NAMES[specialKey];
        } else {
            coatColor += ' ' + dilutionStr;
        }
    }

    // Process white markings
    genes.forEach(gene => {
        if (WHITE_MARKING_NAMES[gene]) {
            allTraits.push(WHITE_MARKING_NAMES[gene]);
        }
    });

    // Check for Leopard Complex patterns
    const lpGene = genes.find(g => g === 'nLp' || g === 'LpLp');
    const patnGene = genes.find(g => g === 'patn' || g === 'patnpatn');
    if (lpGene) {
        const isHomozygousLp = lpGene === 'LpLp';
        const patnStatus = patnGene ? (patnGene === 'patnpatn' ? 'homozygous' : 'heterozygous') : 'none';
        let leopardPattern = '';
        if (isHomozygousLp && patnStatus === 'homozygous') leopardPattern = 'Fewspot';
        else if (isHomozygousLp && patnStatus === 'heterozygous') leopardPattern = 'Snowcap';
        else if (isHomozygousLp && patnStatus === 'none') leopardPattern = 'Varnish Roan';
        else if (!isHomozygousLp && patnStatus === 'homozygous') leopardPattern = 'Leopard';
        else if (!isHomozygousLp && patnStatus === 'heterozygous') leopardPattern = 'Blanket';
        else if (!isHomozygousLp && patnStatus === 'none') leopardPattern = 'Snowflake';
        if (leopardPattern) allTraits.push(leopardPattern);
    }

    // Process modifiers with special handling
    genes.forEach(gene => {
        if (MODIFIER_NAMES[gene]) {
            // Handle compound heterozygous genes by splitting them
            if (gene === 'CuCw') {
                allTraits.push('Crowned');
                allTraits.push('Cuirass');
            } else if (gene === 'PrOp') {
                allTraits.push('Prism');
                allTraits.push('Opal');
            } else if (gene === 'Lusp') {
                allTraits.push('Illuminated');
                allTraits.push('Sepulchered');
            } else if (gene === 'nf') {
                allTraits.push('Carrying Flaxen');
            } else if (gene === 'nsp') {
                allTraits.push('Carrying Sepulchered');
            } else {
                allTraits.push(MODIFIER_NAMES[gene]);
            }
        }
    });

    // Separate traits into before and after coat
    const traitsBeforeCoat = allTraits.filter(trait => TRAITS_BEFORE_COAT.includes(trait));
    const traitsAfterCoat = allTraits.filter(trait => TRAITS_AFTER_COAT.includes(trait));

    // Build phenotype string in in-game format
    const phenotypeParts = [];
    if (traitsBeforeCoat.length > 0) phenotypeParts.push(traitsBeforeCoat.join(' '));
    phenotypeParts.push(coatColor);
    if (traitsAfterCoat.length > 0) phenotypeParts.push(traitsAfterCoat.join(' '));

    let phenotype = phenotypeParts.join(' ');

    // Add anomalies with "with" instead of "+"
    if (anomalies.length > 0) {
        phenotype += ' with ' + anomalies.join(', ');
    }

    return phenotype.trim();
}

function getGeneAlleles(gene) {
    // Extract individual alleles from gene notation
    if (gene === 'EE' || gene === 'Ee' || gene === 'ee') {
        return gene.split('');
    }
    if (gene === 'AA' || gene === 'Aa' || gene === 'aa') {
        return gene.split('');
    }
    
    // For other genes, check if homozygous or heterozygous
    if (gene.startsWith('n')) {
        return ['n', gene.substring(1)];
    }
    
    // Check for combined dilutions
    if (gene.includes('Cr') && gene.includes('prl')) {
        return ['Cr', 'prl'];
    }
    if (gene.includes('Tp') && gene.includes('prl')) {
        return ['Tp', 'prl'];
    }
    if (gene.includes('Tp') && gene.includes('Cr')) {
        return ['Tp', 'Cr'];
    }
    if (gene.includes('prl') && gene.includes('Ch')) {
        return ['prl', 'Ch'];
    }
    if (gene.includes('Cr') && gene.includes('Ch')) {
        return ['Cr', 'Ch'];
    }
    
    // Homozygous versions
    if (gene === 'CrCr') return ['Cr', 'Cr'];
    if (gene === 'TpTp') return ['Tp', 'Tp'];
    if (gene === 'prlprl') return ['prl', 'prl'];
    if (gene === 'erer') return ['er', 'er'];
    if (gene === 'ChCh') return ['Ch', 'Ch'];
    if (gene === 'DD') return ['D', 'D'];
    if (gene === 'TT') return ['T', 'T'];
    if (gene === 'LpLp') return ['Lp', 'Lp'];
    if (gene === 'ff') return ['f', 'f'];
    if (gene === 'spsp') return ['sp', 'sp'];
    if (gene === 'sfsf') return ['sf', 'sf'];
    if (gene === 'fefe') return ['fe', 'fe'];
    
    // Compound heterozygous genes
    if (gene === 'Lusp') return ['Lu', 'sp'];
    if (gene === 'PrOp') return ['Pr', 'Op'];

    // Complex patterns
    if (gene === 'patnpatn') return ['patn', 'patn'];
    if (gene === 'patn') return ['patn'];

    return [gene];
}

function inheritGene(parent1Gene, parent2Gene, probability = 0.5) {
    const alleles1 = getGeneAlleles(parent1Gene);
    const alleles2 = getGeneAlleles(parent2Gene);
    
    // Randomly select one allele from each parent
    const from1 = alleles1[Math.random() < 0.5 ? 0 : Math.min(1, alleles1.length - 1)];
    const from2 = alleles2[Math.random() < 0.5 ? 0 : Math.min(1, alleles2.length - 1)];
    
    return combineAlleles(from1, from2);
}

function combineAlleles(allele1, allele2) {
    // Combine two alleles into proper gene notation
    if (allele1 === allele2) {
        // Homozygous
        if (allele1 === 'E' || allele1 === 'e') return allele1 + allele1;
        if (allele1 === 'A' || allele1 === 'a') return allele1 + allele1;
        if (allele1 === 'Cr') return 'CrCr';
        if (allele1 === 'Tp') return 'TpTp';
        if (allele1 === 'prl') return 'prlprl';
        if (allele1 === 'er') return 'erer';
        if (allele1 === 'Ch') return 'ChCh';
        if (allele1 === 'D') return 'DD';
        if (allele1 === 'T') return 'TT';
        if (allele1 === 'Lp') return 'LpLp';
        if (allele1 === 'f') return 'ff';
        if (allele1 === 'sp') return 'spsp';
        if (allele1 === 'sf') return 'sfsf';
        if (allele1 === 'fe') return 'fefe';
        if (allele1 === 'patn') return 'patnpatn';
        
        return allele1 + allele1;
    }
    
    // Heterozygous
    if ((allele1 === 'E' && allele2 === 'e') || (allele1 === 'e' && allele2 === 'E')) return 'Ee';
    if ((allele1 === 'A' && allele2 === 'a') || (allele1 === 'a' && allele2 === 'A')) return 'Aa';
    
    // Dilution combinations
    if ((allele1 === 'Cr' && allele2 === 'prl') || (allele1 === 'prl' && allele2 === 'Cr')) return 'Crprl';
    if ((allele1 === 'Tp' && allele2 === 'prl') || (allele1 === 'prl' && allele2 === 'Tp')) return 'Tpprl';
    if ((allele1 === 'Tp' && allele2 === 'Cr') || (allele1 === 'Cr' && allele2 === 'Tp')) return 'TpCr';
    if ((allele1 === 'Cr' && allele2 === 'Ch') || (allele1 === 'Ch' && allele2 === 'Cr')) return 'CrCh';
    if ((allele1 === 'prl' && allele2 === 'Ch') || (allele1 === 'Ch' && allele2 === 'prl')) return 'prlCh';
    if ((allele1 === 'Tp' && allele2 === 'Ch') || (allele1 === 'Ch' && allele2 === 'Tp')) return 'TpCh';
    if ((allele1 === 'Cr' && allele2 === 'er') || (allele1 === 'er' && allele2 === 'Cr')) return 'Crer';
    if ((allele1 === 'Tp' && allele2 === 'er') || (allele1 === 'er' && allele2 === 'Tp')) return 'Tper';
    if ((allele1 === 'prl' && allele2 === 'er') || (allele1 === 'er' && allele2 === 'prl')) return 'prler';
    
    // For n + allele combinations
    if (allele1 === 'n') return 'n' + allele2;
    if (allele2 === 'n') return 'n' + allele1;
    
    // Default
    return allele1 + allele2;
}

function inheritBaseCoat(parent1Genes, parent2Genes) {
    // Find E and A genes
    const p1E = parent1Genes.find(g => g.match(/^E[Ee]?$/));
    const p1A = parent1Genes.find(g => g.match(/^A[Aa]?$/));
    const p2E = parent2Genes.find(g => g.match(/^E[Ee]?$/));
    const p2A = parent2Genes.find(g => g.match(/^A[Aa]?$/));
    
    const eGene = inheritGene(p1E || 'Ee', p2E || 'Ee');
    const aGene = inheritGene(p1A || 'Aa', p2A || 'Aa');
    
    return [eGene, aGene];
}

function generateFoal(parent1, parent2, variation) {
    const p1 = parseGenotype(parent1.genotype);
    const p2 = parseGenotype(parent2.genotype);
    
    const foalGenes = [];
    const foalAnomalies = [];
    
    // Base coat
    const [eGene, aGene] = inheritBaseCoat(p1.genes, p2.genes);
    foalGenes.push(eGene, aGene);
    
    // Dilutions - handle all possible combinations
    const dilutionGenes = new Set();
    
    [...p1.genes, ...p2.genes].forEach(gene => {
        if (gene.includes('Cr') || gene.includes('Tp') || gene.includes('prl') || 
            gene.includes('er') || gene.includes('Ch')) {
            
            const alleles = getGeneAlleles(gene);
            alleles.forEach(a => {
                if (Math.random() < 0.5 && a !== 'n') {
                    dilutionGenes.add(a);
                }
            });
        }
    });
    
    // Combine dilutions
    if (dilutionGenes.size > 0) {
        const dilutionArray = Array.from(dilutionGenes);
        if (dilutionArray.length === 1) {
            const allele = dilutionArray[0];
            if (Math.random() < 0.3) {
                foalGenes.push(allele + allele);
            } else {
                foalGenes.push('n' + allele);
            }
        } else if (dilutionArray.length === 2) {
            foalGenes.push(combineAlleles(dilutionArray[0], dilutionArray[1]));
        } else if (dilutionArray.length >= 3) {
            // Complex dilution - limit to 3 max
            foalGenes.push(dilutionArray.slice(0, 3).join(''));
        }
    }
    
    // White markings (excluding Lp and patn - handled separately)
    [...p1.genes, ...p2.genes].forEach(gene => {
        if (gene.match(/^n[A-Z]/) || gene.match(/^[A-Z]{2}/) || gene === 'fefe') {

            if (!gene.match(/^(E|A|Cr|Tp|prl|er|Ch|[nN]?[fsp])/) &&
                !gene.includes('Lp') && !gene.includes('patn')) {
                if (Math.random() < 0.5) {
                    if (!foalGenes.includes(gene)) {
                        foalGenes.push(gene);
                    }
                }
            }
        }
    });
    
    // Leopard complex - inherit Lp and patn genes properly
    const p1Lp = p1.genes.find(g => g.includes('Lp'));
    const p2Lp = p2.genes.find(g => g.includes('Lp'));
    const p1patn = p1.genes.find(g => g.includes('patn'));
    const p2patn = p2.genes.find(g => g.includes('patn'));

    if (p1Lp || p2Lp) {
        // Use Mendelian inheritance for Lp
        const lpGene = inheritGene(p1Lp || 'nn', p2Lp || 'nn');
        if (lpGene !== 'nn' && lpGene !== 'n') {
            foalGenes.push(lpGene);
        }
    }

    if (p1patn || p2patn) {
        // Use Mendelian inheritance for patn (recessive)
        const patnGene = inheritGene(p1patn || 'nn', p2patn || 'nn');
        if (patnGene !== 'nn' && patnGene !== 'n') {
            foalGenes.push(patnGene);
        }
    }
    
    // Modifiers
    const modifierGenes = ['nD', 'nP', 'nSty', 'nG', 'ff', 'nZ', 'nLu', 'spsp', 
                          'nTd', 'nGl', 'nV', 'nOp', 'nPr', 'sfsf'];
    
    [...p1.genes, ...p2.genes].forEach(gene => {
        if (modifierGenes.includes(gene)) {
            if (Math.random() < 0.5) {
                if (!foalGenes.includes(gene)) {
                    foalGenes.push(gene);
                }
            }
        }
    });
    
    // Anomalies (25% chance each)
    [...p1.anomalies, ...p2.anomalies].forEach(anomaly => {
        if (Math.random() < 0.25) {
            if (!foalAnomalies.includes(anomaly)) {
                foalAnomalies.push(anomaly);
            }
        }
    });
    
    // 5% random anomaly
    if (Math.random() < 0.05) {
        const randomAnomalies = ['Bend-or Spots', 'Birdcatcher Spots', 'Brindle', 'Chimera', 
                                'Geode', 'Ore', 'Stained Glass', 'Kintsugi', 'Swarf', 'Vitiligo',
                                'Oracle', 'Signet', 'Pennant', 'Pastiche', 'Fresco', 'Lantern'];
        const random = randomAnomalies[Math.floor(Math.random() * randomAnomalies.length)];
        if (!foalAnomalies.includes(random)) {
            foalAnomalies.push(random);
        }
    }
    
    // Variant inheritance (25% chance from each parent)
    let variant = '';
    if (parent1.variant && parent1.variant !== 'Standard' && Math.random() < 0.25) {
        variant = parent1.variant;
    } else if (parent2.variant && parent2.variant !== 'Standard' && Math.random() < 0.25) {
        variant = parent2.variant;
    }
    
    // Temperament (cannot be same as either parent)
    const temperaments = ['Choleric', 'Melancholic', 'Phlegmatic', 'Sanguine'];
    const availableTemps = temperaments.filter(t => t !== parent1.temperament && t !== parent2.temperament);
    const temperament = availableTemps[Math.floor(Math.random() * availableTemps.length)];
    
    return {
        genotype: foalGenes.join(' ') + (foalAnomalies.length > 0 ? ' + ' + foalAnomalies.join(', ') : ''),
        temperament: temperament,
        variant: variant || 'Standard'
    };
}

function generateFoals() {
    const parent1 = {
        genotype: document.getElementById('parent1Geno').value.trim(),
        temperament: document.getElementById('parent1Temp').value,
        variant: document.getElementById('parent1Variant').value || 'Standard'
    };
    
    const parent2 = {
        genotype: document.getElementById('parent2Geno').value.trim(),
        temperament: document.getElementById('parent2Temp').value,
        variant: document.getElementById('parent2Variant').value || 'Standard'
    };
    
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';
    
    // Validation
    if (!parent1.genotype || !parent2.genotype) {
        errorMsg.textContent = 'Please enter genotypes for both parents!';
        errorMsg.style.display = 'block';
        return;
    }
    
    if (!parent1.temperament || !parent2.temperament) {
        errorMsg.textContent = 'Please select temperaments for both parents!';
        errorMsg.style.display = 'block';
        return;
    }
    
    if (parent1.temperament === parent2.temperament) {
        errorMsg.textContent = 'Cannot breed! Both parents have the same Temperament (' + parent1.temperament + '). Parents must have different Temperaments.';
        errorMsg.style.display = 'block';
        return;
    }
    
    // Generate 4 foals
    const foals = [];
    for (let i = 0; i < 4; i++) {
        foals.push(generateFoal(parent1, parent2, i));
    }
    
    // Display results
    displayFoals(foals);
}

function displayFoals(foals) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');

    resultsGrid.innerHTML = '';

    // Get parent genotypes for Chimera calculation
    const parent1Geno = document.getElementById('parent1Geno').value.trim();
    const parent2Geno = document.getElementById('parent2Geno').value.trim();

    foals.forEach((foal, index) => {
        const card = document.createElement('div');
        card.className = 'foal-card';

        const rarityScore = calculateRarity(foal.genotype);
        const rarityClass = getRarityClass(rarityScore);
        const phenotype = genotypeToPhenotype(foal.genotype);

        // Check if foal has Chimera
        const hasChimera = foal.genotype.toLowerCase().includes('chimera');

        let chimeraSection = '';
        if (hasChimera) {
            const chimeraPossibilities = generateChimeraPossibilities(foal.genotype, parent1Geno, parent2Geno);

            const totalOptions = chimeraPossibilities.baseCoats.length +
                                chimeraPossibilities.dilutions.length +
                                chimeraPossibilities.whiteMarkings.length +
                                chimeraPossibilities.modifiers.length +
                                chimeraPossibilities.anomalies.length;

            chimeraSection = `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #543954;">
                    <strong style="color: #c084fc; display: block; margin-bottom: 10px;">🎨 Chimera Possibilities:</strong>
                    <div style="background: #1d181d; padding: 12px; margin-bottom: 10px; border-left: 3px solid #a855f7;">
                        ${chimeraPossibilities.baseCoats.length > 0 ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: #d4af37; font-size: 0.85em;">Base Coats (${chimeraPossibilities.baseCoats.length}):</strong>
                                <div style="color: #b8a89f; font-size: 0.8em; margin-top: 4px;">${chimeraPossibilities.baseCoats.join(', ')}</div>
                            </div>
                        ` : ''}
                        ${chimeraPossibilities.dilutions.length > 0 ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: #60a5fa; font-size: 0.85em;">Dilutions (${chimeraPossibilities.dilutions.length}):</strong>
                                <div style="color: #b8a89f; font-size: 0.8em; margin-top: 4px;">${chimeraPossibilities.dilutions.join(', ')}</div>
                            </div>
                        ` : ''}
                        ${chimeraPossibilities.whiteMarkings.length > 0 ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: #c084fc; font-size: 0.85em;">Markings (${chimeraPossibilities.whiteMarkings.length}):</strong>
                                <div style="color: #b8a89f; font-size: 0.8em; margin-top: 4px;">${chimeraPossibilities.whiteMarkings.join(', ')}</div>
                            </div>
                        ` : ''}
                        ${chimeraPossibilities.modifiers.length > 0 ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: #4ade80; font-size: 0.85em;">Modifiers (${chimeraPossibilities.modifiers.length}):</strong>
                                <div style="color: #b8a89f; font-size: 0.8em; margin-top: 4px;">${chimeraPossibilities.modifiers.join(', ')}</div>
                            </div>
                        ` : ''}
                        ${chimeraPossibilities.anomalies.length > 0 ? `
                            <div>
                                <strong style="color: #fbbf24; font-size: 0.85em;">Anomalies (${chimeraPossibilities.anomalies.length}):</strong>
                                <div style="color: #b8a89f; font-size: 0.8em; margin-top: 4px;">${chimeraPossibilities.anomalies.join(', ')}</div>
                            </div>
                        ` : ''}
                    </div>
                    <button onclick='fillChimeraCalculator("${foal.genotype.replace(/'/g, "&#39;")}", "${parent1Geno.replace(/'/g, "&#39;")}", "${parent2Geno.replace(/'/g, "&#39;")}")'
                            style="margin-top: 10px; padding: 8px 12px; background: linear-gradient(135deg, #6b4f6b 0%, #543954 100%); color: #c084fc; border: 2px solid #a855f7; cursor: pointer; font-weight: 600; width: 100%; font-size: 0.85em;">
                        View Full Chimera Breakdown
                    </button>
                </div>
            `;
        }

        card.innerHTML = `
            <h3>Foal Option ${index + 1}</h3>
            <div class="foal-detail">
                <strong>Variant:</strong>
                <span>${foal.variant}</span>
            </div>
            <div class="foal-detail">
                <strong>Temperament:</strong>
                <span>${foal.temperament}</span>
            </div>
            <div class="foal-detail">
                <strong>Phenotype:</strong>
                <span>${phenotype}</span>
            </div>
            <div class="foal-detail">
                <strong>Genotype:</strong>
                <span>${foal.genotype}</span>
            </div>
            <span class="rarity-badge ${rarityClass}">Rarity: ${rarityScore}</span>
            ${chimeraSection}
        `;

        resultsGrid.appendChild(card);
    });

    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calculateRarity(genotype) {
    let score = 0;
    
    // Legendary combinations
    if (genotype.includes('Tpprl') && genotype.includes('erer')) score += 100;
    if (genotype.includes('Crprl') && genotype.includes('Ch')) score += 100;
    if (genotype.includes('Crprl') && genotype.includes('erer')) score += 100;
    if (genotype.includes('fefe')) score += 100;
    if (genotype.includes('nOs')) score += 100;
    if (genotype.includes('nPr')) score += 100;
    if (genotype.includes('sfsf')) score += 100;
    
    // Epic
    if (genotype.includes('nSh')) score += 50;
    if (genotype.includes('nHq')) score += 50;
    if (genotype.includes('nOp')) score += 50;
    if (genotype.includes('LpLp patnpatn')) score += 50;
    
    // Rare
    if (genotype.includes('prlprl')) score += 25;
    if (genotype.includes('erer') && score < 50) score += 25;
    if (genotype.includes('nTd')) score += 25;
    if (genotype.includes('nGl')) score += 25;
    if (genotype.includes('nFl')) score += 25;
    
    return score;
}

function getRarityClass(score) {
    if (score >= 100) return 'legendary';
    if (score >= 50) return 'epic';
    if (score >= 25) return 'rare';
    if (score >= 10) return 'uncommon';
    return 'common';
}

// Custom Scroll Generator
// Categorize genes by rarity for custom scroll generation
const RARITY_GENES = {
    legendary: {
        coatColors: [
            // Triple dilution combinations
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'Tpprl', 'erer'] },  // Tyrian Pearl Ether
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'Tpprl', 'erer'] }, // Phthalo Pearl Ether
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'Tpprl', 'erer'] }, // Ochre Pearl Ether
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'TpprlCh'] }, // Tyrian Pearl Champagne
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'TpprlCh'] }, // Phthalo Pearl Champagne
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'TpprlCh'] }, // Ochre Pearl Champagne
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'Crprler'] }, // Ombre Cream Pearl Ether
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'Crprler'] }, // Classic Cream Pearl Ether
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'Crprler'] }, // Cold Cream Pearl Ether
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'CrprlCh'] }, // Amber Cream Pearl Champagne
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'CrprlCh'] }, // Classic Cream Pearl Champagne
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'CrprlCh'] }, // Gold Cream Pearl Champagne
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'TpCrer'] }, // Madder Cream Ether
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'TpCrer'] }, // Woad Cream Ether
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'TpCrer'] }, // Weld Cream Ether
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'TpCrCh'] }, // Madder Cream Champagne
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'TpCrCh'] }, // Woad Cream Champagne
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'TpCrCh'] } // Weld Cream Champagne
        ],
        markings: ['fefe', 'nOs'],
        modifiers: ['nPr', 'sfsf']
    },
    epic: {
        coatColors: [
            // Double dilution combinations
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'Tpprl'] }, // Tyrian Pearl
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'Tpprl'] }, // Phthalo Pearl
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'Tpprl'] }, // Ochre Pearl
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'prler'] }, // Bay Pearl Ether
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'prler'] }, // Black Pearl Ether
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'prler'] }, // Gold Pearl Ether
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'Tper'] }, // Madder Ether
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'Tper'] }, // Woad Ether
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'Tper'] }, // Weld Ether
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'TpCr'] }, // Madder Buckskin
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'TpCr'] }, // Woad Smoky Black
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'TpCr'] }, // Weld Palomino
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'Crprl'] }, // Bay Cream Pearl
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'Crprl'] }, // Black Cream Pearl
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'Crprl'] }, // Gold Cream Pearl
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'prlCh'] }, // Bay Pearl Champagne
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'prlCh'] }, // Black Pearl Champagne
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'prlCh'] }, // Gold Pearl Champagne
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'CrCh'] }, // Bay Cream Champagne
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'CrCh'] }, // Black Cream Champagne
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'CrCh'] }, // Gold Cream Champagne
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'Crer'] }, // Bay Cream Ether
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'Crer'] }, // Black Cream Ether
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'Crer'] }, // Gold Cream Ether
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'TpCh'] }, // Madder Champagne
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'TpCh'] }, // Woad Champagne
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'TpCh'] } // Weld Champagne
        ],
        markings: ['nSh', 'nHq', 'LpLp patnpatn'],
        modifiers: ['nOp']
    },
    rare: {
        coatColors: [
            // Homozygous dilutions
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'prlprl'] }, // Bay Pearl
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'prlprl'] }, // Black Pearl
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'prlprl'] }, // Gold Pearl
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'erer'] }, // Bay Ether
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'erer'] }, // Black Ether
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'erer'] } // Chestnut Ether
        ],
        markings: ['nFl'],
        modifiers: ['nTd', 'nGl']
    },
    uncommon: {
        coatColors: [
            // Single dilutions
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'nCr'] }, // Buckskin
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'nCr'] }, // Smoky Black
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'nCr'] }, // Palomino
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'CrCr'] }, // Perlino
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'CrCr'] }, // Smoky Cream
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'CrCr'] }, // Cremello
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'nTp'] }, // Madder
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'nTp'] }, // Woad
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'nTp'] }, // Weld
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'nprl'] }, // Bay Pearl (het)
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'nprl'] }, // Black Pearl (het)
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'nprl'] }, // Gold Pearl (het)
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'nCh'] }, // Amber Champagne
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'nCh'] }, // Classic Champagne
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'nCh'] }, // Gold Champagne
            { baseCoat: 'Bay', genes: ['Ee', 'AA', 'ner'] }, // Ombre Ether
            { baseCoat: 'Black', genes: ['Ee', 'aa', 'ner'] }, // Classic Ether
            { baseCoat: 'Chestnut', genes: ['ee', 'AA', 'ner'] } // Cold Ether
        ],
        markings: ['nT', 'nO', 'nSpl', 'nR', 'nSb', 'Lp patn', 'nB', 'nSf', 'nfe'],
        modifiers: ['nD', 'nP', 'nSty', 'nG', 'nf', 'nZ', 'nLu', 'nsp', 'nV']
    },
    common: {
        coatColors: [
            { baseCoat: 'Bay', genes: ['Ee', 'AA'] },
            { baseCoat: 'Black', genes: ['Ee', 'aa'] },
            { baseCoat: 'Chestnut', genes: ['ee', 'AA'] }
        ],
        markings: ['nGi', 'nCo', 'nBl', 'nW', 'nRb', 'nCu', 'nCw'],
        modifiers: []
    }
};

const TEMPERAMENTS = ['Choleric', 'Melancholic', 'Phlegmatic', 'Sanguine'];
const VARIANTS = ['Standard', 'Heraldic', 'Puck', 'Cavedweller'];
const ALL_ANOMALIES = [
    'Bend-or Spots', 'Birdcatcher Spots', 'Brindle', 'Chimera',
    'Geode', 'Ore', 'Stained Glass', 'Kintsugi', 'Swarf', 'Vitiligo',
    'Oracle', 'Signet', 'Pennant', 'Pastiche', 'Fresco', 'Lantern'
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateCustomScroll(rarity) {
    const rarityKey = rarity.toLowerCase();
    const rarityData = RARITY_GENES[rarityKey];

    if (!rarityData) {
        alert('Invalid rarity level!');
        return null;
    }

    // Build list of available coat colors (this rarity level)
    let availableCoatColors = [...rarityData.coatColors];

    // Build list of available markings/modifiers (this rarity and lower)
    const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const rarityIndex = rarityOrder.indexOf(rarityKey);

    let availableMarkings = [];
    let availableModifiers = [];

    for (let i = 0; i <= rarityIndex; i++) {
        const currentRarity = rarityOrder[i];
        availableMarkings = availableMarkings.concat(RARITY_GENES[currentRarity].markings);
        availableModifiers = availableModifiers.concat(RARITY_GENES[currentRarity].modifiers);
    }

    // Generate the horse
    const genes = [];

    // 1. Select random coat color
    const selectedCoat = getRandomElement(availableCoatColors);
    genes.push(...selectedCoat.genes);

    // 2. Select 1 marking, modifier, or carrier (50/50 split between marking and modifier)
    const allTraits = [...availableMarkings, ...availableModifiers];
    if (allTraits.length > 0) {
        const selectedTrait = getRandomElement(allTraits);
        genes.push(selectedTrait);
    }

    // 3. 10% chance of random anomaly
    const anomalies = [];
    if (Math.random() < 0.10) {
        anomalies.push(getRandomElement(ALL_ANOMALIES));
    }

    // 4. 5% chance of random variant (non-Standard)
    let variant = 'Standard';
    if (Math.random() < 0.05) {
        const nonStandardVariants = VARIANTS.filter(v => v !== 'Standard');
        variant = getRandomElement(nonStandardVariants);
    }

    // 5. Random temperament
    const temperament = getRandomElement(TEMPERAMENTS);

    // Build genotype string
    let genotype = genes.join(' ');
    if (anomalies.length > 0) {
        genotype += ' + ' + anomalies.join(', ');
    }

    return {
        genotype: genotype,
        temperament: temperament,
        variant: variant,
        rarity: rarity
    };
}

function displayCustomScrollResult() {
    const raritySelect = document.getElementById('scrollRarity');
    const rarity = raritySelect.value;

    const result = generateCustomScroll(rarity);
    if (!result) return;

    const resultDiv = document.getElementById('scrollResult');
    const phenotype = genotypeToPhenotype(result.genotype);
    const rarityScore = calculateRarity(result.genotype);
    const rarityClass = getRarityClass(rarityScore);

    resultDiv.innerHTML = `
        <div class="scroll-result-card">
            <h3>Your ${rarity} Custom Scroll Creation</h3>
            <div class="result-section">
                <h4>Phenotype:</h4>
                <p class="phenotype">${phenotype}</p>
            </div>
            <div class="result-section">
                <h4>Genotype:</h4>
                <p class="geno">${result.genotype}</p>
            </div>
            <div class="result-section">
                <h4>Stats:</h4>
                <p><strong>Temperament:</strong> ${result.temperament}</p>
                <p><strong>Variant:</strong> ${result.variant}</p>
                <span class="rarity-badge ${rarityClass}">Rarity: ${rarityScore}</span>
            </div>
            <button onclick="displayCustomScrollResult()"
                    style="margin-top: 15px; padding: 10px 20px; background: #543954; color: #d4af37; border: 2px solid #d4af37; cursor: pointer; font-weight: 600;">
                Generate Another
            </button>
        </div>
    `;

    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Breeding Search Functionality
function searchBreeding() {
    const query = document.getElementById('breedingQuery').value.toLowerCase().trim();
    const resultsDiv = document.getElementById('searchResults');
    const resultsContent = document.getElementById('searchResultsContent');
    
    if (!query) {
        alert('Please enter a breeding question!');
        return;
    }
    
    if (horseCollection.length === 0) {
        alert('Please upload your horse collection CSV first!');
        return;
    }
    
    resultsContent.innerHTML = '';
    
    // Extract target traits from query
    const targetTraits = extractTraitsFromQuery(query);
    
    if (targetTraits.length === 0) {
        resultsContent.innerHTML = '<p style="color: #b8a89f;">Could not identify specific traits in your query. Try asking like: "How can I make Amber Champagne?" or "Who can breed for fewspot?"</p>';
        resultsDiv.style.display = 'block';
        return;
    }
    
    // Find breeding pairs that could produce these traits
    const matches = findBreedingMatches(targetTraits);
    
    if (matches.length === 0) {
        resultsContent.innerHTML = `<p style="color: #b8a89f;">No breeding pairs found in your collection that can produce: <strong style="color: #d4af37;">${targetTraits.join(', ')}</strong></p>`;
    } else {
        resultsContent.innerHTML = `<p style="color: #b8a89f; margin-bottom: 20px;">Found <strong style="color: #d4af37;">${matches.length}</strong> possible breeding pair(s) for: <strong style="color: #d4af37;">${targetTraits.join(', ')}</strong></p>`;
        
        matches.slice(0, 10).forEach(match => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <h4>${match.parent1.name} × ${match.parent2.name}</h4>
                <p><strong>Parent 1:</strong> ${match.parent1.id} - ${match.parent1.temperament}</p>
                <span class="geno">${match.parent1.genotype}</span>
                <p><strong>Parent 2:</strong> ${match.parent2.id} - ${match.parent2.temperament}</p>
                <span class="geno">${match.parent2.genotype}</span>
                <p style="margin-top: 10px;"><strong style="color: #d4af37;">Match Score:</strong> ${match.score} | <strong style="color: #d4af37;">Probability:</strong> ${match.probability}</p>
                <button onclick='fillParents(${JSON.stringify(match.parent1).replace(/'/g, "&apos;")}, ${JSON.stringify(match.parent2).replace(/'/g, "&apos;")})' 
                        style="margin-top: 10px; padding: 8px 16px; background: #543954; color: #d4af37; border: 2px solid #d4af37; cursor: pointer; font-weight: 600;">
                    Use This Pair
                </button>
            `;
            resultsContent.appendChild(item);
        });
    }
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function extractTraitsFromQuery(query) {
    const traits = [];
    
    // Coat colors - check specific names first, then generic ones
    // Legendary triple dilutions
    if (query.includes('tyrian pearl champagne')) traits.push('Tyrian Pearl Champagne');
    if (query.includes('phthalo pearl champagne')) traits.push('Phthalo Pearl Champagne');
    if (query.includes('ochre pearl champagne')) traits.push('Ochre Pearl Champagne');
    if (query.includes('tyrian pearl ether')) traits.push('Tyrian Pearl Ether');
    if (query.includes('phthalo pearl ether')) traits.push('Phthalo Pearl Ether');
    if (query.includes('ochre pearl ether')) traits.push('Ochre Pearl Ether');
    if (query.includes('madder cream champagne')) traits.push('Madder Cream Champagne');
    if (query.includes('woad cream champagne')) traits.push('Woad Cream Champagne');
    if (query.includes('weld cream champagne')) traits.push('Weld Cream Champagne');
    if (query.includes('madder cream ether')) traits.push('Madder Cream Ether');
    if (query.includes('woad cream ether')) traits.push('Woad Cream Ether');
    if (query.includes('weld cream ether')) traits.push('Weld Cream Ether');
    if (query.includes('amber cream pearl champagne')) traits.push('Amber Cream Pearl Champagne');
    if (query.includes('classic cream pearl champagne')) traits.push('Classic Cream Pearl Champagne');
    if (query.includes('gold cream pearl champagne')) traits.push('Gold Cream Pearl Champagne');
    if (query.includes('ombre cream pearl ether')) traits.push('Ombre Cream Pearl Ether');
    if (query.includes('classic cream pearl ether')) traits.push('Classic Cream Pearl Ether');
    if (query.includes('cold cream pearl ether')) traits.push('Cold Cream Pearl Ether');

    // Epic double dilutions
    if (query.includes('tyrian pearl')) traits.push('Tyrian Pearl');
    if (query.includes('phthalo pearl')) traits.push('Phthalo Pearl');
    if (query.includes('ochre pearl')) traits.push('Ochre Pearl');
    if (query.includes('madder ether')) traits.push('Madder Ether');
    if (query.includes('woad ether')) traits.push('Woad Ether');
    if (query.includes('weld ether')) traits.push('Weld Ether');
    if (query.includes('bay pearl ether')) traits.push('Bay Pearl Ether');
    if (query.includes('black pearl ether')) traits.push('Black Pearl Ether');
    if (query.includes('gold pearl ether')) traits.push('Gold Pearl Ether');
    if (query.includes('madder buckskin')) traits.push('Madder Buckskin');
    if (query.includes('woad smoky black')) traits.push('Woad Smoky Black');
    if (query.includes('weld palomino')) traits.push('Weld Palomino');

    // Common/Uncommon single dilutions
    if (query.includes('amber champagne') || query.includes('amber champ')) traits.push('Amber Champagne');
    if (query.includes('gold champagne') || query.includes('gold champ')) traits.push('Gold Champagne');
    if (query.includes('classic champagne')) traits.push('Classic Champagne');
    if (query.includes('bay pearl')) traits.push('Bay Pearl');
    if (query.includes('black pearl')) traits.push('Black Pearl');
    if (query.includes('gold pearl')) traits.push('Gold Pearl');
    if (query.includes('madder')) traits.push('Madder');
    if (query.includes('woad')) traits.push('Woad');
    if (query.includes('weld')) traits.push('Weld');
    if (query.includes('buckskin')) traits.push('Buckskin');
    if (query.includes('smoky black')) traits.push('Smoky Black');
    if (query.includes('palomino')) traits.push('Palomino');
    if (query.includes('perlino')) traits.push('Perlino');
    if (query.includes('smoky cream')) traits.push('Smoky Cream');
    if (query.includes('cremello')) traits.push('Cremello');

    // Generic dilution genes (fallback)
    if (query.includes('cream') && !query.includes('pearl')) traits.push('Cream');
    if (query.includes('pearl') && !query.includes('cream')) traits.push('Pearl');
    if (query.includes('cream pearl') || query.includes('pearl cream')) traits.push('Cream Pearl');
    if (query.includes('tapestry')) traits.push('Tapestry');
    if (query.includes('ether')) traits.push('Ether');
    
    // White markings
    // Leopard Complex patterns
    if (query.includes('fewspot')) traits.push('Fewspot');
    if (query.includes('snowcap')) traits.push('Snowcap');
    if (query.includes('varnish')) traits.push('Varnish Roan');
    if (query.includes('leopard')) traits.push('Leopard');
    if (query.includes('blanket')) traits.push('Blanket');
    if (query.includes('snowflake')) traits.push('Snowflake');

    // Other white markings
    if (query.includes('tobiano')) traits.push('Tobiano');
    if (query.includes('overo')) traits.push('Overo');
    if (query.includes('splash')) traits.push('Splash');
    if (query.includes('roan')) traits.push('Roan');
    if (query.includes('sabino')) traits.push('Sabino');
    if (query.includes('shroud')) traits.push('Shroud');
    if (query.includes('ossuary')) traits.push('Ossuary');
    if (query.includes('filigree')) traits.push('Filigree');
    if (query.includes('harlequin')) traits.push('Harlequin');
    
    // Modifiers
    if (query.includes('starfield')) traits.push('Starfield');
    if (query.includes('gilt')) traits.push('Gilt');
    if (query.includes('tabard')) traits.push('Tabard');
    if (query.includes('opal')) traits.push('Opal');
    if (query.includes('prism')) traits.push('Prism');
    if (query.includes('gray') || query.includes('grey')) traits.push('Gray');
    if (query.includes('dun')) traits.push('Dun');
    if (query.includes('illuminated')) traits.push('Illuminated');
    if (query.includes('sepulchered')) traits.push('Sepulchered');
    
    return traits;
}

function findBreedingMatches(targetTraits) {
    const matches = [];
    
    for (let i = 0; i < horseCollection.length; i++) {
        for (let j = i + 1; j < horseCollection.length; j++) {
            const parent1 = horseCollection[i];
            const parent2 = horseCollection[j];
            
            // Check temperament compatibility
            if (parent1.temperament === parent2.temperament) continue;
            
            // Check if this pair can produce the target traits
            const score = calculateMatchScore(parent1, parent2, targetTraits);
            
            if (score > 0) {
                matches.push({
                    parent1: parent1,
                    parent2: parent2,
                    score: score,
                    probability: estimateProbability(parent1, parent2, targetTraits)
                });
            }
        }
    }
    
    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);
    
    return matches;
}

function canProduceCompoundDilution(p1Geno, p2Geno, dilution1, dilution2) {
    // Cr, Tp, and prl are allelic - they share a locus
    // A parent with Tpprl can pass either Tp OR prl (they're on separate alleles)
    // A parent with Crprl can pass either Cr OR prl
    // etc.

    const compound = dilution1 + dilution2;
    const reverseCompound = dilution2 + dilution1;

    // Check if either parent already has the exact compound
    if (p1Geno.includes(compound) || p2Geno.includes(compound) ||
        p1Geno.includes(reverseCompound) || p2Geno.includes(reverseCompound)) {
        return true;
    }

    // Check what dilution alleles each parent can pass
    // A parent can pass a dilution if they have it as:
    // - heterozygous: nCr, nTp, nprl, ner
    // - homozygous: CrCr, TpTp, prlprl, erer
    // - compound: Crprl, TpCr, Tpprl, etc. (can pass EITHER component)

    function canPassDilution(geno, dilution) {
        const d = dilution.toLowerCase();
        // Has it standalone (hetero or homo)
        if (geno.includes('n' + d) || geno.includes(' ' + d + ' ') || geno.includes(d + d)) {
            return true;
        }
        // Check if it's part of any compound dilution
        // Since Cr, Tp, prl, er, Ch are allelic, a compound like Tpprl means parent can pass either Tp or prl
        if (geno.includes(d)) {
            return true;
        }
        return false;
    }

    const p1Can1 = canPassDilution(p1Geno, dilution1);
    const p1Can2 = canPassDilution(p1Geno, dilution2);
    const p2Can1 = canPassDilution(p2Geno, dilution1);
    const p2Can2 = canPassDilution(p2Geno, dilution2);

    // One parent can pass dilution1, other can pass dilution2
    return (p1Can1 && p2Can2) || (p1Can2 && p2Can1);
}

function calculateMatchScore(parent1, parent2, targetTraits) {
    const p1Geno = parent1.genotype.toLowerCase();
    const p2Geno = parent2.genotype.toLowerCase();
    const combinedGeno = (p1Geno + ' ' + p2Geno);

    // Track which traits are possible
    let traitsScores = [];

    targetTraits.forEach(trait => {
        const traitLower = trait.toLowerCase();

        // Check for specific genes that create this trait
        // Compound dilutions with Cream Pearl + Ether
        if (traitLower.includes('cream pearl ether') || traitLower === 'ombre cream pearl ether' ||
            traitLower === 'classic cream pearl ether' || traitLower === 'cold cream pearl ether') {
            // Need Crprl + erer (homozygous ether requires BOTH parents have ether)
            const hasCreamPearl = canProduceCompoundDilution(p1Geno, p2Geno, 'cr', 'prl');
            const p1HasEther = p1Geno.includes('erer') || p1Geno.includes('ner') || p1Geno.includes('er');
            const p2HasEther = p2Geno.includes('erer') || p2Geno.includes('ner') || p2Geno.includes('er');
            const canMakeErer = p1HasEther && p2HasEther;
            if (hasCreamPearl && canMakeErer) traitsScores.push(150);
        } else if (traitLower.includes('cream pearl champagne')) {
            // Need Crprl + Ch
            const hasCreamPearl = canProduceCompoundDilution(p1Geno, p2Geno, 'cr', 'prl');
            const hasChampagne = combinedGeno.includes('nch') || combinedGeno.includes('ch');
            if (hasCreamPearl && hasChampagne) traitsScores.push(150);
        } else if (traitLower.includes('tapestry pearl ether') || traitLower === 'tyrian pearl ether' ||
                   traitLower === 'phthalo pearl ether' || traitLower === 'ochre pearl ether') {
            // Need Tpprl + erer (homozygous ether requires BOTH parents have ether)
            const hasTapestryPearl = canProduceCompoundDilution(p1Geno, p2Geno, 'tp', 'prl');
            const p1HasEther = p1Geno.includes('erer') || p1Geno.includes('ner') || p1Geno.includes('er');
            const p2HasEther = p2Geno.includes('erer') || p2Geno.includes('ner') || p2Geno.includes('er');
            const canMakeErer = p1HasEther && p2HasEther;
            if (hasTapestryPearl && canMakeErer) traitsScores.push(150);
        } else if (traitLower.includes('tapestry pearl champagne')) {
            // Need Tpprl + Ch
            const hasTapestryPearl = canProduceCompoundDilution(p1Geno, p2Geno, 'tp', 'prl');
            const hasChampagne = combinedGeno.includes('nch') || combinedGeno.includes('ch');
            if (hasTapestryPearl && hasChampagne) traitsScores.push(150);
        } else if (traitLower.includes('tapestry cream ether') || traitLower === 'madder cream ether' ||
                   traitLower === 'woad cream ether' || traitLower === 'weld cream ether') {
            // Need TpCr + erer (homozygous ether requires BOTH parents have ether)
            const hasTapestryCream = canProduceCompoundDilution(p1Geno, p2Geno, 'tp', 'cr');
            const p1HasEther = p1Geno.includes('erer') || p1Geno.includes('ner') || p1Geno.includes('er');
            const p2HasEther = p2Geno.includes('erer') || p2Geno.includes('ner') || p2Geno.includes('er');
            const canMakeErer = p1HasEther && p2HasEther;
            if (hasTapestryCream && canMakeErer) traitsScores.push(150);
        } else if (traitLower.includes('tapestry cream champagne') || traitLower === 'madder cream champagne' ||
                   traitLower === 'woad cream champagne' || traitLower === 'weld cream champagne') {
            // Need TpCr + Ch
            const hasTapestryCream = canProduceCompoundDilution(p1Geno, p2Geno, 'tp', 'cr');
            const hasChampagne = combinedGeno.includes('nch') || combinedGeno.includes('ch');
            if (hasTapestryCream && hasChampagne) traitsScores.push(150);
        } else if (traitLower.includes('pearl ether') && !traitLower.includes('cream') && !traitLower.includes('tapestry')) {
            // Need prlprl + erer (homozygous pearl and ether)
            const p1HasPearl = p1Geno.includes('prl');
            const p2HasPearl = p2Geno.includes('prl');
            const p1HasEther = p1Geno.includes('erer') || p1Geno.includes('ner') || p1Geno.includes('er');
            const p2HasEther = p2Geno.includes('erer') || p2Geno.includes('ner') || p2Geno.includes('er');
            if (p1HasPearl && p2HasPearl && p1HasEther && p2HasEther) traitsScores.push(120);
        } else if (traitLower.includes('cream pearl') && !traitLower.includes('ether') && !traitLower.includes('champagne')) {
            // Need Crprl (cream pearl compound)
            if (canProduceCompoundDilution(p1Geno, p2Geno, 'cr', 'prl')) traitsScores.push(100);
        } else if (traitLower.includes('tapestry pearl') && !traitLower.includes('ether') && !traitLower.includes('champagne')) {
            // Need Tpprl (tapestry pearl compound)
            if (canProduceCompoundDilution(p1Geno, p2Geno, 'tp', 'prl')) traitsScores.push(100);
        } else if (traitLower.includes('woad')) {
            if (combinedGeno.includes('tp') && (combinedGeno.includes('e') && combinedGeno.includes('aa'))) traitsScores.push(100);
        } else if (traitLower.includes('madder')) {
            if (combinedGeno.includes('tp') && (combinedGeno.includes('e') && combinedGeno.includes('a'))) traitsScores.push(100);
        } else if (traitLower.includes('weld')) {
            if (combinedGeno.includes('tp') && combinedGeno.includes('ee')) traitsScores.push(100);
        } else if (traitLower.includes('buckskin')) {
            if (combinedGeno.includes('cr') && (combinedGeno.includes('e') && combinedGeno.includes('a'))) traitsScores.push(100);
        } else if (traitLower.includes('smoky black')) {
            if (combinedGeno.includes('cr') && (combinedGeno.includes('e') && combinedGeno.includes('aa'))) traitsScores.push(100);
        } else if (traitLower.includes('palomino')) {
            if (combinedGeno.includes('cr') && combinedGeno.includes('ee')) traitsScores.push(100);
        } else if (traitLower.includes('perlino')) {
            if (combinedGeno.includes('crcr') && (combinedGeno.includes('e') && combinedGeno.includes('a'))) traitsScores.push(100);
        } else if (traitLower.includes('smoky cream')) {
            if (combinedGeno.includes('crcr') && (combinedGeno.includes('e') && combinedGeno.includes('aa'))) traitsScores.push(100);
        } else if (traitLower.includes('cremello')) {
            if (combinedGeno.includes('crcr') && combinedGeno.includes('ee')) traitsScores.push(100);
        } else if (traitLower.includes('amber champagne')) {
            if (combinedGeno.includes('ch') && (combinedGeno.includes('e') && combinedGeno.includes('a'))) traitsScores.push(100);
        } else if (traitLower.includes('fewspot')) {
            // Need LpLp patnpatn - BOTH parents must have Lp AND patn
            const p1HasLp = p1Geno.includes('lp');
            const p2HasLp = p2Geno.includes('lp');
            const p1HasPatn = p1Geno.includes('patn');
            const p2HasPatn = p2Geno.includes('patn');
            if (p1HasLp && p2HasLp && p1HasPatn && p2HasPatn) traitsScores.push(100);
        } else if (traitLower.includes('snowcap')) {
            // Need LpLp npatn - BOTH parents must have Lp, at least one has patn, but not both homozygous
            const p1HasLp = p1Geno.includes('lp');
            const p2HasLp = p2Geno.includes('lp');
            const p1HasPatn = p1Geno.includes('patn');
            const p2HasPatn = p2Geno.includes('patn');
            if (p1HasLp && p2HasLp && (p1HasPatn || p2HasPatn)) traitsScores.push(100);
        } else if (traitLower.includes('varnish roan')) {
            // Need LpLp npatn - BOTH parents must have Lp, neither has patn
            const p1HasLp = p1Geno.includes('lp');
            const p2HasLp = p2Geno.includes('lp');
            if (p1HasLp && p2HasLp && !combinedGeno.includes('patn')) traitsScores.push(100);
        } else if (traitLower.includes('leopard')) {
            // Need nLp patnpatn - at least one parent has Lp, BOTH have patn
            const hasLp = combinedGeno.includes('lp');
            const p1HasPatn = p1Geno.includes('patn');
            const p2HasPatn = p2Geno.includes('patn');
            if (hasLp && p1HasPatn && p2HasPatn) traitsScores.push(100);
        } else if (traitLower.includes('blanket')) {
            // Need nLp npatn - at least one parent has Lp, at least one has patn
            const hasLp = combinedGeno.includes('lp');
            const hasPatn = combinedGeno.includes('patn');
            if (hasLp && hasPatn) traitsScores.push(100);
        } else if (traitLower.includes('snowflake')) {
            // Need nLp npatn - at least one parent has Lp, neither has patn
            const hasLp = combinedGeno.includes('lp');
            if (hasLp && !combinedGeno.includes('patn')) traitsScores.push(100);
        } else if (traitLower.includes('starfield')) {
            // Need sfsf - BOTH parents must have sf
            const p1HasSf = p1Geno.includes('sfsf') || p1Geno.includes('nsf');
            const p2HasSf = p2Geno.includes('sfsf') || p2Geno.includes('nsf');
            if (p1HasSf && p2HasSf) traitsScores.push(100);
        } else if (traitLower.includes('ether')) {
            if (combinedGeno.includes('erer') || combinedGeno.includes('ner')) traitsScores.push(80);
        } else if (traitLower.includes('filigree')) {
            // Need fefe - BOTH parents must have fe
            const p1HasFe = p1Geno.includes('fefe') || p1Geno.includes('nfe');
            const p2HasFe = p2Geno.includes('fefe') || p2Geno.includes('nfe');
            if (p1HasFe && p2HasFe) traitsScores.push(100);
        } else if (traitLower.includes('ossuary')) {
            if (combinedGeno.includes('nos')) traitsScores.push(100);
        } else if (traitLower.includes('shroud')) {
            if (combinedGeno.includes('nsh')) traitsScores.push(80);
        } else if (combinedGeno.includes(traitLower.substring(0, 3))) {
            traitsScores.push(50);
        }
    });

    // Only return total score if ALL traits can be produced in a single foal
    if (traitsScores.length === targetTraits.length) {
        return traitsScores.reduce((sum, s) => sum + s, 0);
    }
    return 0; // Can't make all traits in one foal
}

function estimateProbability(parent1, parent2, targetTraits) {
    // Simple probability estimation
    const p1Geno = parent1.genotype.toLowerCase();
    const p2Geno = parent2.genotype.toLowerCase();
    
    let hasAllGenes = true;
    targetTraits.forEach(trait => {
        const traitKey = trait.toLowerCase().substring(0, 3);
        if (!p1Geno.includes(traitKey) && !p2Geno.includes(traitKey)) {
            hasAllGenes = false;
        }
    });
    
    if (!hasAllGenes) return 'Low (~5-10%)';
    
    const genesInBoth = targetTraits.filter(trait => {
        const key = trait.toLowerCase().substring(0, 3);
        return p1Geno.includes(key) && p2Geno.includes(key);
    }).length;
    
    if (genesInBoth === targetTraits.length) return 'High (~40-60%)';
    if (genesInBoth > 0) return 'Medium (~20-35%)';
    return 'Low (~10-20%)';
}

function fillParents(parent1, parent2) {
    document.getElementById('parent1Geno').value = parent1.genotype;
    document.getElementById('parent1Temp').value = parent1.temperament;
    document.getElementById('parent1Variant').value = parent1.variant || 'Standard';

    document.getElementById('parent2Geno').value = parent2.genotype;
    document.getElementById('parent2Temp').value = parent2.temperament;
    document.getElementById('parent2Variant').value = parent2.variant || 'Standard';

    // Scroll to the parents section
    document.querySelector('.parents-container').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Show a confirmation
    alert(`Filled in breeding pair:\n${parent1.name} × ${parent2.name}\n\nClick "Generate Foal Possibilities" to see results!`);
}

// Chimera Functionality
function generateChimeraPossibilities(foalGenotype, parent1Genotype, parent2Genotype) {
    const foal = parseGenotype(foalGenotype);
    const p1 = parseGenotype(parent1Genotype);
    const p2 = parseGenotype(parent2Genotype);

    // Combine all genes available from both parents
    const allParentGenes = [...p1.genes, ...p2.genes];
    const allParentAnomalies = [...p1.anomalies, ...p2.anomalies];

    // Get all possible alleles from parents
    const eAlleles = new Set();
    const aAlleles = new Set();

    allParentGenes.forEach(gene => {
        if (gene.match(/^[Ee][Ee]?$/)) {
            const alleles = getGeneAlleles(gene);
            alleles.forEach(a => eAlleles.add(a));
        }
        if (gene.match(/^[Aa][Aa]?$/)) {
            const alleles = getGeneAlleles(gene);
            alleles.forEach(a => aAlleles.add(a));
        }
    });

    const eArray = Array.from(eAlleles);
    const aArray = Array.from(aAlleles);

    // Generate all possible base coats
    const baseCoats = new Set();
    for (let i = 0; i < eArray.length; i++) {
        for (let j = i; j < eArray.length; j++) {
            for (let k = 0; k < aArray.length; k++) {
                for (let l = k; l < aArray.length; l++) {
                    const eGene = combineAlleles(eArray[i], eArray[j]);
                    const aGene = combineAlleles(aArray[k], aArray[l]);
                    const baseCoatKey = `${eGene}_${aGene}`;
                    const baseCoatName = COAT_COLORS[baseCoatKey];
                    if (baseCoatName) {
                        baseCoats.add(baseCoatName);
                    }
                }
            }
        }
    }

    // Get all available dilutions from parents
    const dilutionNames = new Set();
    allParentGenes.forEach(gene => {
        if (DILUTION_NAMES[gene]) {
            dilutionNames.add(DILUTION_NAMES[gene]);
        }
    });

    // Get all available modifiers
    const modifiers = new Set();

    // For recessive genes, check if both parents carry the allele
    const recessiveGenes = ['f', 'sp', 'sf', 'fe']; // Flaxen, Sepulchered, Starfield, Filigree
    const parent1Alleles = new Set();
    const parent2Alleles = new Set();

    p1.genes.forEach(gene => {
        const alleles = getGeneAlleles(gene);
        alleles.forEach(a => parent1Alleles.add(a));
    });

    p2.genes.forEach(gene => {
        const alleles = getGeneAlleles(gene);
        alleles.forEach(a => parent2Alleles.add(a));
    });

    allParentGenes.forEach(gene => {
        if (MODIFIER_NAMES[gene]) {
            const name = MODIFIER_NAMES[gene];

            // Check if this is a recessive gene that needs both parents
            if (gene.startsWith('n') && gene.length > 2) {
                const allele = gene.substring(1);
                if (recessiveGenes.includes(allele)) {
                    // Only add if both parents have this allele
                    if (parent1Alleles.has(allele) && parent2Alleles.has(allele)) {
                        modifiers.add(name);
                    }
                    return;
                }
            } else if (recessiveGenes.some(r => gene === r + r)) {
                // Homozygous recessive (like spsp, ff, etc.)
                const allele = gene.substring(0, gene.length / 2);
                if (parent1Alleles.has(allele) && parent2Alleles.has(allele)) {
                    modifiers.add(name);
                }
                return;
            }

            // For compound heterozygous (like Lusp), extract what actually shows
            if (gene === 'Lusp') {
                modifiers.add('Illuminated'); // Lu is dominant
                // Only add Sepulchered if both parents have sp allele
                if (parent1Alleles.has('sp') && parent2Alleles.has('sp')) {
                    modifiers.add('Sepulchered');
                }
                return;
            }

            if (gene === 'PrOp') {
                modifiers.add('Prism'); // Pr is dominant
                modifiers.add('Opal'); // Op is dominant
                return;
            }

            // All other modifiers (dominant or already filtered)
            modifiers.add(name);
        }
    });

    // Similar check for white markings with recessive genes
    const whiteMarkings = new Set();
    allParentGenes.forEach(gene => {
        if (WHITE_MARKING_NAMES[gene]) {
            const name = WHITE_MARKING_NAMES[gene];

            // Check Filigree (recessive)
            if (gene === 'nfe' || gene === 'fefe') {
                if (parent1Alleles.has('fe') && parent2Alleles.has('fe')) {
                    whiteMarkings.add(name);
                }
                return;
            }

            // All other white markings (dominant)
            whiteMarkings.add(name);
        }
    });

    // Generate Leopard Complex patterns from Lp and patn combinations
    // Check if we can make nLp (need at least one parent with Lp)
    const canMakeHetLp = (parent1Alleles.has('Lp') || parent2Alleles.has('Lp'));

    // Check if we can make LpLp (need both parents with Lp)
    const canMakeHomLp = parent1Alleles.has('Lp') && parent2Alleles.has('Lp');

    // Check if patn can be inherited (both parents must have it for it to show as homozygous)
    const canShowPatn = parent1Alleles.has('patn') && parent2Alleles.has('patn');

    // Generate all possible Leopard Complex patterns (only if at least one parent has Lp)
    if (canMakeHetLp) {
        const leopardPatterns = new Set();

        // Patterns WITH patn (only if both parents carry patn)
        if (canMakeHetLp && canShowPatn) {
            // nLp patnpatn = Leopard
            leopardPatterns.add('Leopard');
            // nLp patn = Blanket
            leopardPatterns.add('Blanket');
        }

        if (canMakeHomLp && canShowPatn) {
            // LpLp patnpatn = Fewspot
            leopardPatterns.add('Fewspot');
            // LpLp patn = Snowcap
            leopardPatterns.add('Snowcap');
        }

        // Patterns WITHOUT patn (always possible - patch might not inherit patn)
        if (canMakeHetLp) {
            // nLp (no patn) = Snowflake
            leopardPatterns.add('Snowflake');
        }

        if (canMakeHomLp) {
            // LpLp (no patn) = Varnish Roan
            leopardPatterns.add('Varnish Roan');
        }

        // Add all possible patterns to white markings
        leopardPatterns.forEach(pattern => whiteMarkings.add(pattern));
    }

    // Get parent anomalies (excluding Chimera)
    const anomalies = new Set(allParentAnomalies.filter(a => a !== 'Chimera'));

    return {
        baseCoats: Array.from(baseCoats).sort(),
        dilutions: Array.from(dilutionNames).sort(),
        whiteMarkings: Array.from(whiteMarkings).sort(),
        modifiers: Array.from(modifiers).sort(),
        anomalies: Array.from(anomalies).sort()
    };
}

function fillChimeraCalculator(foalGeno, parent1Geno, parent2Geno) {
    document.getElementById('chimeraFoalGeno').value = foalGeno;
    document.getElementById('chimeraParent1Geno').value = parent1Geno;
    document.getElementById('chimeraParent2Geno').value = parent2Geno;

    // Scroll to the Chimera calculator
    document.getElementById('chimeraResultsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Automatically calculate
    calculateChimera();
}

function calculateChimera() {
    const foalGeno = document.getElementById('chimeraFoalGeno').value.trim();
    const parent1Geno = document.getElementById('chimeraParent1Geno').value.trim();
    const parent2Geno = document.getElementById('chimeraParent2Geno').value.trim();

    if (!foalGeno || !parent1Geno || !parent2Geno) {
        alert('Please enter genotypes for the foal and both parents!');
        return;
    }

    // Check if foal has Chimera
    if (!foalGeno.toLowerCase().includes('chimera')) {
        alert('Warning: The foal genotype does not include Chimera trait. Calculating possibilities anyway...');
    }

    const possibilities = generateChimeraPossibilities(foalGeno, parent1Geno, parent2Geno);

    displayChimeraPossibilities(foalGeno, possibilities);
}

function displayChimeraPossibilities(foalGenotype, possibilities) {
    const resultsContainer = document.getElementById('chimeraResultsContainer');
    const resultsContent = document.getElementById('chimeraResultsContent');

    resultsContent.innerHTML = '';

    // Display main foal coat
    const foalPhenotype = genotypeToPhenotype(foalGenotype);

    const mainCoatDiv = document.createElement('div');
    mainCoatDiv.style.cssText = 'background: #2a232a; border: 2px solid #d4af37; padding: 20px; margin-bottom: 20px;';
    mainCoatDiv.innerHTML = `
        <h4 style="color: #d4af37; margin-bottom: 10px; font-size: 1.1em;">Main Coat (Non-Chimera Areas)</h4>
        <div style="margin-bottom: 10px;">
            <strong style="color: #b8a89f;">Phenotype:</strong>
            <span style="color: #d4af37; display: block; margin-top: 5px;">${foalPhenotype}</span>
        </div>
        <div>
            <strong style="color: #b8a89f;">Genotype:</strong>
            <span style="color: #d4af37; font-family: 'Courier New', monospace; display: block; margin-top: 5px; background: #1d181d; padding: 8px; border: 1px solid #543954;">${foalGenotype}</span>
        </div>
    `;
    resultsContent.appendChild(mainCoatDiv);

    // Display Chimera possibilities header
    const chimeraHeader = document.createElement('h4');
    chimeraHeader.style.cssText = 'color: #d4af37; margin-bottom: 15px; font-size: 1.1em;';
    chimeraHeader.textContent = 'Chimera Patch Possibilities';
    resultsContent.appendChild(chimeraHeader);

    const infoBox = document.createElement('div');
    infoBox.style.cssText = 'background: #3a2f3a; border-left: 4px solid #a855f7; padding: 15px; margin-bottom: 20px; color: #b8a89f; font-style: italic;';
    infoBox.textContent = 'The Chimera patch can display any combination of the traits listed below from both parents.';
    resultsContent.appendChild(infoBox);

    // Create grid for categories
    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;';

    // Base Coats
    if (possibilities.baseCoats.length > 0) {
        const baseCoatCard = document.createElement('div');
        baseCoatCard.style.cssText = 'background: #3a2f3a; padding: 20px; border: 2px solid #543954; border-left: 4px solid #d4af37;';
        baseCoatCard.innerHTML = `
            <h5 style="color: #d4af37; margin-bottom: 15px; font-size: 1em; font-weight: 600;">Base Coats (${possibilities.baseCoats.length})</h5>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${possibilities.baseCoats.map(coat => `
                    <li style="padding: 8px; margin-bottom: 6px; background: #1d181d; border-left: 3px solid #d4af37; color: #d4af37;">
                        ${coat}
                    </li>
                `).join('')}
            </ul>
        `;
        grid.appendChild(baseCoatCard);
    }

    // Dilutions
    if (possibilities.dilutions.length > 0) {
        const dilutionCard = document.createElement('div');
        dilutionCard.style.cssText = 'background: #3a2f3a; padding: 20px; border: 2px solid #543954; border-left: 4px solid #60a5fa;';
        dilutionCard.innerHTML = `
            <h5 style="color: #60a5fa; margin-bottom: 15px; font-size: 1em; font-weight: 600;">Dilutions (${possibilities.dilutions.length})</h5>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${possibilities.dilutions.map(dilution => `
                    <li style="padding: 8px; margin-bottom: 6px; background: #1d181d; border-left: 3px solid #60a5fa; color: #d4af37;">
                        ${dilution}
                    </li>
                `).join('')}
            </ul>
        `;
        grid.appendChild(dilutionCard);
    }

    // White Markings
    if (possibilities.whiteMarkings.length > 0) {
        const markingsCard = document.createElement('div');
        markingsCard.style.cssText = 'background: #3a2f3a; padding: 20px; border: 2px solid #543954; border-left: 4px solid #c084fc;';
        markingsCard.innerHTML = `
            <h5 style="color: #c084fc; margin-bottom: 15px; font-size: 1em; font-weight: 600;">White Markings (${possibilities.whiteMarkings.length})</h5>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${possibilities.whiteMarkings.map(marking => `
                    <li style="padding: 8px; margin-bottom: 6px; background: #1d181d; border-left: 3px solid #c084fc; color: #d4af37;">
                        ${marking}
                    </li>
                `).join('')}
            </ul>
        `;
        grid.appendChild(markingsCard);
    }

    // Modifiers
    if (possibilities.modifiers.length > 0) {
        const modifiersCard = document.createElement('div');
        modifiersCard.style.cssText = 'background: #3a2f3a; padding: 20px; border: 2px solid #543954; border-left: 4px solid #4ade80;';
        modifiersCard.innerHTML = `
            <h5 style="color: #4ade80; margin-bottom: 15px; font-size: 1em; font-weight: 600;">Modifiers (${possibilities.modifiers.length})</h5>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${possibilities.modifiers.map(modifier => `
                    <li style="padding: 8px; margin-bottom: 6px; background: #1d181d; border-left: 3px solid #4ade80; color: #d4af37;">
                        ${modifier}
                    </li>
                `).join('')}
            </ul>
        `;
        grid.appendChild(modifiersCard);
    }

    // Anomalies
    if (possibilities.anomalies.length > 0) {
        const anomaliesCard = document.createElement('div');
        anomaliesCard.style.cssText = 'background: #3a2f3a; padding: 20px; border: 2px solid #543954; border-left: 4px solid #fbbf24;';
        anomaliesCard.innerHTML = `
            <h5 style="color: #fbbf24; margin-bottom: 15px; font-size: 1em; font-weight: 600;">Anomalies (${possibilities.anomalies.length})</h5>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${possibilities.anomalies.map(anomaly => `
                    <li style="padding: 8px; margin-bottom: 6px; background: #1d181d; border-left: 3px solid #fbbf24; color: #d4af37;">
                        ${anomaly}
                    </li>
                `).join('')}
            </ul>
        `;
        grid.appendChild(anomaliesCard);
    }

    resultsContent.appendChild(grid);

    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
