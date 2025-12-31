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

const DILUTION_NAMES = {
    'Cr': 'Cream', 'CrCr': 'Double Cream',
    'Tp': 'Tapestry', 'TpTp': 'Tapestry',
    'prl': 'Pearl', 'prlprl': 'Pearl',
    'Ch': 'Champagne', 'ChCh': 'Champagne',
    'er': 'Ether', 'erer': 'Ether',
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
    'ff': 'Flaxen',
    'nZ': 'Silver',
    'nLu': 'Illuminated',
    'spsp': 'Sepulchered',
    'nTd': 'Tabard',
    'nGl': 'Gilt',
    'nV': 'Vellum',
    'nOp': 'Opal',
    'nPr': 'Prism',
    'sfsf': 'Starfield',
    'PrOp': 'Prism Opal',
    'Lusp': 'Illuminated'
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
    'nLp': 'Varnish Roan',
    'LpLp': 'Varnish Roan',
    'nW': 'Dominant White',
    'nRb': 'Rabicano',
    'nFl': 'False Leopard',
    'nHq': 'Harlequin',
    'nFs': 'Fewspot',
    'nSh': 'Shroud',
    'fefe': 'Filigree',
    'nOs': 'Ossuary'
};

function parseGenotype(genoString) {
    const parts = genoString.trim().split('+');
    const genes = parts[0].trim().split(/\s+/);
    const anomalies = parts.length > 1 ? parts[1].trim().split(',').map(a => a.trim()) : [];
    
    return { genes, anomalies };
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
    
    // White markings
    [...p1.genes, ...p2.genes].forEach(gene => {
        if (gene.match(/^n[A-Z]/) || gene.match(/^[A-Z]{2}/) || gene === 'fefe' || 
            gene.includes('Lp') || gene.includes('patn')) {
            
            if (!gene.match(/^(E|A|Cr|Tp|prl|er|Ch|[nN]?[fsp])/)) {
                if (Math.random() < 0.5) {
                    if (!foalGenes.includes(gene)) {
                        foalGenes.push(gene);
                    }
                }
            }
        }
    });
    
    // Leopard complex
    const p1Lp = p1.genes.find(g => g.includes('Lp'));
    const p2Lp = p2.genes.find(g => g.includes('Lp'));
    const p1patn = p1.genes.filter(g => g.includes('patn')).length;
    const p2patn = p2.genes.filter(g => g.includes('patn')).length;
    
    if (p1Lp || p2Lp) {
        if (Math.random() < 0.5) {
            const lpAlleles = [];
            if (p1Lp) lpAlleles.push(...getGeneAlleles(p1Lp));
            if (p2Lp) lpAlleles.push(...getGeneAlleles(p2Lp));
            
            const lpGene = lpAlleles[Math.floor(Math.random() * lpAlleles.length)];
            if (lpGene === 'Lp') {
                foalGenes.push(Math.random() < 0.3 ? 'LpLp' : 'nLp');
            }
            
            // Pattern genes
            const totalPatn = p1patn + p2patn;
            if (totalPatn > 0 && Math.random() < 0.6) {
                foalGenes.push(Math.random() < 0.3 ? 'patnpatn' : 'patn');
            }
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
    
    foals.forEach((foal, index) => {
        const card = document.createElement('div');
        card.className = 'foal-card';
        
        const rarityScore = calculateRarity(foal.genotype);
        const rarityClass = getRarityClass(rarityScore);
        
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
                <strong>Genotype:</strong>
                <span>${foal.genotype}</span>
            </div>
            <span class="rarity-badge ${rarityClass}">Rarity: ${rarityScore}</span>
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
    if (query.includes('fewspot')) traits.push('Fewspot');
    if (query.includes('leopard')) traits.push('Leopard');
    if (query.includes('blanket')) traits.push('Blanket');
    if (query.includes('varnish')) traits.push('Varnish Roan');
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
            if (combinedGeno.includes('lplp') && combinedGeno.includes('patn')) score += 100;
        } else if (traitLower.includes('starfield')) {
            if (combinedGeno.includes('sfsf')) score += 100;
        } else if (traitLower.includes('cream pearl')) {
            if (combinedGeno.includes('prl') && combinedGeno.includes('cr')) score += 100;
        } else if (traitLower.includes('ether')) {
            if (combinedGeno.includes('erer') || combinedGeno.includes('ner')) score += 80;
        } else if (traitLower.includes('leopard')) {
            if (combinedGeno.includes('lp') && combinedGeno.includes('patn')) score += 80;
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
