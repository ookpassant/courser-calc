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

    // Tapestry + Cream combinations
    'Madder_Cream': 'Madder Buckskin',
    'Woad_Cream': 'Woad Smoky Black',
    'Weld_Cream': 'Weld Palomino',
    'Bay_Tapestry Cream': 'Madder Buckskin',
    'Black_Tapestry Cream': 'Woad Smoky Black',
    'Chestnut_Tapestry Cream': 'Weld Palomino'
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
    let whiteMarkings = [];
    let modifiers = [];

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

    // Find white markings
    genes.forEach(gene => {
        if (WHITE_MARKING_NAMES[gene]) {
            whiteMarkings.push(WHITE_MARKING_NAMES[gene]);
        }
    });

    // Check for Leopard Complex patterns (Lp + patn combinations)
    const lpGene = genes.find(g => g === 'nLp' || g === 'LpLp');
    const patnGene = genes.find(g => g === 'patn' || g === 'patnpatn');

    if (lpGene) {
        const isHomozygousLp = lpGene === 'LpLp';
        const patnStatus = patnGene ? (patnGene === 'patnpatn' ? 'homozygous' : 'heterozygous') : 'none';

        let leopardPattern = '';
        if (isHomozygousLp && patnStatus === 'homozygous') {
            leopardPattern = 'Fewspot';
        } else if (isHomozygousLp && patnStatus === 'heterozygous') {
            leopardPattern = 'Snowcap';
        } else if (isHomozygousLp && patnStatus === 'none') {
            leopardPattern = 'Varnish Roan';
        } else if (!isHomozygousLp && patnStatus === 'homozygous') {
            leopardPattern = 'Leopard';
        } else if (!isHomozygousLp && patnStatus === 'heterozygous') {
            leopardPattern = 'Blanket';
        } else if (!isHomozygousLp && patnStatus === 'none') {
            leopardPattern = 'Snowflake';
        }

        if (leopardPattern) {
            whiteMarkings.push(leopardPattern);
        }
    }

    // Find modifiers (with special handling for recessive genes)
    genes.forEach(gene => {
        if (MODIFIER_NAMES[gene]) {
            // Special case for Flaxen - show "Carrying" for heterozygous
            if (gene === 'nf') {
                modifiers.push('Carrying Flaxen');
            } else {
                modifiers.push(MODIFIER_NAMES[gene]);
            }
        }
    });

    // Build phenotype string with special coat color names
    let phenotype = baseCoat;

    if (dilutions.length > 0) {
        const dilutionStr = dilutions.join(' ');
        const specialKey = `${baseCoat}_${dilutionStr}`;

        // Check if there's a special name for this base + dilution combination
        if (SPECIAL_COAT_NAMES[specialKey]) {
            phenotype = SPECIAL_COAT_NAMES[specialKey];
        } else {
            phenotype += ' ' + dilutionStr;
        }
    }

    if (whiteMarkings.length > 0) {
        phenotype += ' with ' + whiteMarkings.join(', ');
    }

    if (modifiers.length > 0) {
        phenotype += (whiteMarkings.length > 0 ? ' and ' : ' with ') + modifiers.join(', ');
    }

    if (anomalies.length > 0) {
        phenotype += ' + ' + anomalies.join(', ');
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
    
    // Coat colors
    if (query.includes('amber champagne') || query.includes('amber champ')) traits.push('Amber Champagne');
    if (query.includes('gold champagne') || query.includes('gold champ')) traits.push('Gold Champagne');
    if (query.includes('classic champagne')) traits.push('Classic Champagne');
    if (query.includes('cream') && !query.includes('pearl')) traits.push('Cream');
    if (query.includes('pearl') && !query.includes('cream')) traits.push('Pearl');
    if (query.includes('cream pearl') || query.includes('pearl cream')) traits.push('Cream Pearl');
    if (query.includes('tapestry')) traits.push('Tapestry');
    if (query.includes('ether')) traits.push('Ether');
    if (query.includes('perlino')) traits.push('Perlino');
    if (query.includes('smoky')) traits.push('Smoky');
    if (query.includes('buckskin')) traits.push('Buckskin');
    
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

function calculateMatchScore(parent1, parent2, targetTraits) {
    let score = 0;
    const combinedGeno = (parent1.genotype + ' ' + parent2.genotype).toLowerCase();
    
    targetTraits.forEach(trait => {
        const traitLower = trait.toLowerCase();
        
        // Check for specific genes that create this trait
        if (traitLower.includes('amber champagne')) {
            if (combinedGeno.includes('nch') && (combinedGeno.includes('ee aa') || combinedGeno.includes('ee_aa'))) score += 100;
        } else if (traitLower.includes('fewspot')) {
            if (combinedGeno.includes('lplp') && combinedGeno.includes('patnpatn')) score += 100;
        } else if (traitLower.includes('snowcap')) {
            if (combinedGeno.includes('lplp') && combinedGeno.includes('patn') && !combinedGeno.includes('patnpatn')) score += 100;
        } else if (traitLower.includes('varnish roan')) {
            if (combinedGeno.includes('lplp') && !combinedGeno.includes('patn')) score += 100;
        } else if (traitLower.includes('leopard')) {
            if (combinedGeno.includes('nlp') && combinedGeno.includes('patnpatn')) score += 100;
        } else if (traitLower.includes('blanket')) {
            if (combinedGeno.includes('nlp') && combinedGeno.includes('patn') && !combinedGeno.includes('patnpatn')) score += 100;
        } else if (traitLower.includes('snowflake')) {
            if (combinedGeno.includes('nlp') && !combinedGeno.includes('patn')) score += 100;
        } else if (traitLower.includes('starfield')) {
            if (combinedGeno.includes('sfsf')) score += 100;
        } else if (traitLower.includes('cream pearl')) {
            if (combinedGeno.includes('prl') && combinedGeno.includes('cr')) score += 100;
        } else if (traitLower.includes('ether')) {
            if (combinedGeno.includes('erer') || combinedGeno.includes('ner')) score += 80;
        } else if (traitLower.includes('filigree')) {
            if (combinedGeno.includes('fefe') || combinedGeno.includes('nfe')) score += 100;
        } else if (traitLower.includes('ossuary')) {
            if (combinedGeno.includes('nos')) score += 100;
        } else if (traitLower.includes('shroud')) {
            if (combinedGeno.includes('nsh')) score += 80;
        } else if (combinedGeno.includes(traitLower.substring(0, 3))) {
            score += 50;
        }
    });
    
    return score;
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
