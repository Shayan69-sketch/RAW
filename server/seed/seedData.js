import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

const categories = [
  { name: 'T-Shirts & Tops', slug: 't-shirts-tops', description: 'Performance t-shirts and tops', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', order: 1 },
  { name: 'Hoodies & Jackets', slug: 'hoodies-jackets', description: 'Warm layers for training', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop', order: 2 },
  { name: 'Shorts', slug: 'shorts', description: 'Training and lifestyle shorts', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=600&fit=crop', order: 3 },
  { name: 'Joggers & Bottoms', slug: 'joggers-bottoms', description: 'Joggers, pants, and leggings', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=600&fit=crop', order: 4 },
  { name: 'Sports Bras', slug: 'sports-bras', description: 'Supportive sports bras', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=600&fit=crop', order: 5 },
  { name: 'Leggings', slug: 'leggings', description: 'Performance leggings', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop', order: 6 },
  { name: 'Tank Tops & Vests', slug: 'tank-tops-vests', description: 'Breathable tank tops', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50c?w=600&h=600&fit=crop', order: 7 },
  { name: 'Accessories', slug: 'accessories', description: 'Gym accessories and essentials', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop', order: 8 },
  { name: 'Stringers', slug: 'stringers', description: 'Classic gym stringers', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop', order: 9 },
  { name: 'Underwear', slug: 'underwear', description: 'Performance underwear', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=600&fit=crop', order: 10 },
];

const img = (id, w = 800, h = 1000) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`;

const generateProducts = (cm) => [
  // ── MEN'S T-SHIRTS (3) ──
  {
    name: 'Apex Seamless T-Shirt', slug: 'apex-seamless-tshirt-men', description: 'Engineered with seamless knit technology for zero-distraction comfort during intense workouts.', details: '• Seamless knit\\n• Sweat-wicking\\n• Muscle fit\\n• 92% Nylon, 8% Elastane', careInstructions: 'Machine wash 30°C.', category: cm['t-shirts-tops'], gender: 'men', sportType: ['lifting', 'training'], tags: ['seamless', 'performance'], basePrice: 42,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1581009146145-b5ef050c2e1e'), altText: 'Black Apex Tee', isPrimary: true }, { url: img('1571019614242-c5c5dee9f50c'), altText: 'Black Apex Back', isPrimary: false }], sizes: [{ size: 'S', sku: 'APX-BLK-S', stock: 25 }, { size: 'M', sku: 'APX-BLK-M', stock: 40 }, { size: 'L', sku: 'APX-BLK-L', stock: 30 }, { size: 'XL', sku: 'APX-BLK-XL', stock: 20 }] },
      { color: 'Light Grey', colorHex: '#c4c4c4', images: [{ url: img('1583454110551-21f2fa2afe61'), altText: 'Grey Apex Tee', isPrimary: true }], sizes: [{ size: 'S', sku: 'APX-GRY-S', stock: 15 }, { size: 'M', sku: 'APX-GRY-M', stock: 30 }, { size: 'L', sku: 'APX-GRY-L', stock: 25 }] },
      { color: 'Navy', colorHex: '#1a2744', images: [{ url: img('1534438327276-14e5300c3a48'), altText: 'Navy Apex Tee', isPrimary: true }], sizes: [{ size: 'M', sku: 'APX-NVY-M', stock: 20 }, { size: 'L', sku: 'APX-NVY-L', stock: 18 }] },
    ], ratings: { average: 4.7, count: 234 }, isFeatured: true, isTrending: true, isBestSeller: true, totalSold: 1520
  },
  {
    name: 'Power Oversized T-Shirt', slug: 'power-oversized-tshirt-men', description: 'Heavyweight cotton with a boxy silhouette for that relaxed, effortless aesthetic.', details: '• 100% Cotton, 250gsm\\n• Oversized fit\\n• Dropped shoulders', careInstructions: 'Machine wash 30°C.', category: cm['t-shirts-tops'], gender: 'men', sportType: ['lifting', 'everyday'], tags: ['oversized', 'cotton'], basePrice: 36, salePrice: 28, isSale: true,
    variants: [
      { color: 'Off White', colorHex: '#f5f0eb', images: [{ url: img('1521572163474-6864f9cf17ab'), altText: 'Off White Power Tee', isPrimary: true }], sizes: [{ size: 'S', sku: 'PWR-OWH-S', stock: 12 }, { size: 'M', sku: 'PWR-OWH-M', stock: 28 }, { size: 'L', sku: 'PWR-OWH-L', stock: 22 }, { size: 'XL', sku: 'PWR-OWH-XL', stock: 8 }] },
      { color: 'Charcoal', colorHex: '#36454f', images: [{ url: img('1556906781-9a412961c28c'), altText: 'Charcoal Power Tee', isPrimary: true }], sizes: [{ size: 'M', sku: 'PWR-CHR-M', stock: 3 }, { size: 'L', sku: 'PWR-CHR-L', stock: 15 }] },
    ], ratings: { average: 4.5, count: 178 }, isTrending: true, totalSold: 980
  },
  {
    name: 'Element Graphic Tee', slug: 'element-graphic-tee-men', description: 'Bold graphic print on soft-touch cotton. Stand out in the gym.', details: '• 100% Cotton\\n• Regular fit\\n• Screen-printed graphic', careInstructions: 'Machine wash cold inside out.', category: cm['t-shirts-tops'], gender: 'men', sportType: ['everyday'], tags: ['graphic', 'casual'], basePrice: 30,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1503341504253-dff4f5657911'), altText: 'Black Graphic Tee', isPrimary: true }], sizes: [{ size: 'S', sku: 'ELM-BLK-S', stock: 20 }, { size: 'M', sku: 'ELM-BLK-M', stock: 35 }, { size: 'L', sku: 'ELM-BLK-L', stock: 28 }] },
      { color: 'White', colorHex: '#ffffff', images: [{ url: img('1622470953794-aa9c70b0fb9d'), altText: 'White Graphic Tee', isPrimary: true }], sizes: [{ size: 'M', sku: 'ELM-WHT-M', stock: 22 }, { size: 'L', sku: 'ELM-WHT-L', stock: 18 }] },
    ], ratings: { average: 4.3, count: 112 }, isFeatured: true, totalSold: 650
  },
  // ── MEN'S HOODIES (2) ──
  {
    name: 'Crest Zip Hoodie', slug: 'crest-zip-hoodie-men', description: 'Full-zip hoodie with brushed fleece interior. Essential layering piece.', details: '• 80% Cotton, 20% Polyester\\n• 320gsm fleece\\n• Full zip\\n• Side pockets', careInstructions: 'Machine wash cold.', category: cm['hoodies-jackets'], gender: 'men', sportType: ['training', 'everyday'], tags: ['hoodie', 'essentials'], basePrice: 60,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1556906781-9a412961c28c'), altText: 'Black Crest Hoodie', isPrimary: true }, { url: img('1578662996442-48f60103fc96'), altText: 'Black Crest Side', isPrimary: false }], sizes: [{ size: 'S', sku: 'CRT-BLK-S', stock: 18 }, { size: 'M', sku: 'CRT-BLK-M', stock: 35 }, { size: 'L', sku: 'CRT-BLK-L', stock: 28 }, { size: 'XL', sku: 'CRT-BLK-XL', stock: 15 }] },
      { color: 'Stone Grey', colorHex: '#8d8d8d', images: [{ url: img('1542327897-d73f4005a8c6'), altText: 'Grey Crest Hoodie', isPrimary: true }], sizes: [{ size: 'M', sku: 'CRT-GRY-M', stock: 20 }, { size: 'L', sku: 'CRT-GRY-L', stock: 16 }] },
    ], ratings: { average: 4.8, count: 312 }, isFeatured: true, isBestSeller: true, totalSold: 2100
  },
  {
    name: 'Urban Tech Jacket', slug: 'urban-tech-jacket-men', description: 'Lightweight, water-resistant jacket. Perfect for outdoor training sessions.', details: '• Windproof shell\\n• DWR coating\\n• Reflective details\\n• Zip pockets', careInstructions: 'Machine wash cold. No fabric softener.', category: cm['hoodies-jackets'], gender: 'men', sportType: ['running', 'everyday'], tags: ['jacket', 'waterproof'], basePrice: 78,
    variants: [
      { color: 'Midnight', colorHex: '#191970', images: [{ url: img('1544966503-7cc5c6e5ce93'), altText: 'Midnight Tech Jacket', isPrimary: true }], sizes: [{ size: 'S', sku: 'UTJ-MID-S', stock: 12 }, { size: 'M', sku: 'UTJ-MID-M', stock: 20 }, { size: 'L', sku: 'UTJ-MID-L', stock: 15 }] },
    ], ratings: { average: 4.6, count: 89 }, isTrending: true, totalSold: 430
  },
  // ── MEN'S SHORTS (2) ──
  {
    name: 'Sport 7" Shorts', slug: 'sport-7-shorts-men', description: 'Lightweight with 4-way stretch. Built for performance with a secure zip pocket.', details: '• 88% Polyester, 12% Elastane\\n• 7" inseam\\n• Drawcord waist\\n• Zip pocket', careInstructions: 'Machine wash cold.', category: cm['shorts'], gender: 'men', sportType: ['running', 'training'], tags: ['shorts', 'performance'], basePrice: 32,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1571019613454-1bd2f1e7f68e'), altText: 'Black Sport Shorts', isPrimary: true }], sizes: [{ size: 'S', sku: 'SPT-BLK-S', stock: 30 }, { size: 'M', sku: 'SPT-BLK-M', stock: 45 }, { size: 'L', sku: 'SPT-BLK-L', stock: 35 }] },
      { color: 'Navy', colorHex: '#1a2744', images: [{ url: img('1517836357463-d25dfeac3438'), altText: 'Navy Sport Shorts', isPrimary: true }], sizes: [{ size: 'M', sku: 'SPT-NVY-M', stock: 25 }, { size: 'L', sku: 'SPT-NVY-L', stock: 20 }] },
    ], ratings: { average: 4.6, count: 156 }, isTrending: true, totalSold: 890
  },
  {
    name: 'Flex 5" Training Shorts', slug: 'flex-5-training-shorts-men', description: 'Ultra-light 5-inch shorts for explosive training. Breathable mesh lining.', details: '• 100% Polyester\\n• 5" inseam\\n• Mesh liner\\n• Elastic waistband', careInstructions: 'Machine wash cold.', category: cm['shorts'], gender: 'men', sportType: ['training', 'lifting'], tags: ['shorts', 'training'], basePrice: 28, salePrice: 22, isSale: true,
    variants: [
      { color: 'Grey Marl', colorHex: '#9e9e9e', images: [{ url: img('1591195853828-11db59a44f6b'), altText: 'Grey Training Shorts', isPrimary: true }], sizes: [{ size: 'S', sku: 'FLX-GRY-S', stock: 18 }, { size: 'M', sku: 'FLX-GRY-M', stock: 30 }, { size: 'L', sku: 'FLX-GRY-L', stock: 22 }] },
    ], ratings: { average: 4.4, count: 95 }, isBestSeller: true, totalSold: 720
  },
  // ── MEN'S JOGGERS (2) ──
  {
    name: 'Critical Joggers', slug: 'critical-joggers-men', description: 'Tapered slim-fit joggers with soft fleece interior. Gym to street.', details: '• 70% Cotton, 30% Polyester\\n• Slim fit\\n• Elasticated cuffs\\n• Two pockets', careInstructions: 'Machine wash 30°C.', category: cm['joggers-bottoms'], gender: 'men', sportType: ['training', 'everyday'], tags: ['joggers', 'essentials'], basePrice: 48,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1581009137042-c552e485697a'), altText: 'Black Joggers', isPrimary: true }], sizes: [{ size: 'S', sku: 'CJG-BLK-S', stock: 22 }, { size: 'M', sku: 'CJG-BLK-M', stock: 38 }, { size: 'L', sku: 'CJG-BLK-L', stock: 30 }, { size: 'XL', sku: 'CJG-BLK-XL', stock: 15 }] },
      { color: 'Stone', colorHex: '#b8a99a', images: [{ url: img('1552902865-b72c031ac5ea'), altText: 'Stone Joggers', isPrimary: true }], sizes: [{ size: 'M', sku: 'CJG-STN-M', stock: 18 }, { size: 'L', sku: 'CJG-STN-L', stock: 14 }] },
    ], ratings: { average: 4.4, count: 198 }, isFeatured: true, isBestSeller: true, totalSold: 1750
  },
  {
    name: 'Compound Cargo Joggers', slug: 'compound-cargo-joggers-men', description: 'Utility cargo joggers with zippered side pockets. Streetwear meets gym.', details: '• 95% Cotton, 5% Elastane\\n• Relaxed taper\\n• Cargo pockets\\n• Drawcord waist', careInstructions: 'Machine wash 30°C.', category: cm['joggers-bottoms'], gender: 'men', sportType: ['everyday'], tags: ['cargo', 'streetwear'], basePrice: 55,
    variants: [
      { color: 'Olive', colorHex: '#556b2f', images: [{ url: img('1490645935967-10de6ba17061'), altText: 'Olive Cargo Joggers', isPrimary: true }], sizes: [{ size: 'M', sku: 'CCG-OLV-M', stock: 15 }, { size: 'L', sku: 'CCG-OLV-L', stock: 20 }, { size: 'XL', sku: 'CCG-OLV-XL', stock: 10 }] },
    ], ratings: { average: 4.5, count: 67 }, isTrending: true, totalSold: 380
  },
  // ── MEN'S TANK/STRINGER (2) ──
  {
    name: 'Bold React Tank', slug: 'bold-react-tank-men', description: 'Cut for freedom of movement. Moisture-wicking with dropped armholes.', details: '• 100% Polyester\\n• Moisture-wicking\\n• Relaxed fit', careInstructions: 'Machine wash cold.', category: cm['tank-tops-vests'], gender: 'men', sportType: ['lifting', 'training'], tags: ['tank', 'performance'], basePrice: 28,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1581009146145-b5ef050c2e1e'), altText: 'Black Tank', isPrimary: true }], sizes: [{ size: 'S', sku: 'BLD-BLK-S', stock: 18 }, { size: 'M', sku: 'BLD-BLK-M', stock: 30 }, { size: 'L', sku: 'BLD-BLK-L', stock: 25 }] },
      { color: 'Moss', colorHex: '#556b2f', images: [{ url: img('1534438327276-14e5300c3a48'), altText: 'Moss Tank', isPrimary: true }], sizes: [{ size: 'M', sku: 'BLD-MOS-M', stock: 20 }, { size: 'L', sku: 'BLD-MOS-L', stock: 15 }] },
    ], ratings: { average: 4.4, count: 87 }, totalSold: 380
  },
  {
    name: 'Arrival Stringer', slug: 'arrival-stringer-men', description: 'Classic bodybuilding stringer with modern cut. Max ventilation mesh.', details: '• 100% Polyester mesh\\n• Racerback\\n• Relaxed fit', careInstructions: 'Machine wash cold.', category: cm['stringers'], gender: 'men', sportType: ['lifting'], tags: ['stringer', 'bodybuilding'], basePrice: 24,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1583454110551-21f2fa2afe61'), altText: 'Black Stringer', isPrimary: true }], sizes: [{ size: 'S', sku: 'ARV-BLK-S', stock: 20 }, { size: 'M', sku: 'ARV-BLK-M', stock: 30 }, { size: 'L', sku: 'ARV-BLK-L', stock: 25 }] },
    ], ratings: { average: 4.5, count: 98 }, totalSold: 450
  },
  // ── WOMEN'S LEGGINGS (3) ──
  {
    name: 'Vital Seamless 2.0 Leggings', slug: 'vital-seamless-leggings-women', description: 'Iconic high-waisted seamless leggings with contouring lines. Squat-proof.', details: '• Seamless knit\\n• High waisted\\n• Squat-proof\\n• 92% Nylon, 8% Elastane', careInstructions: 'Machine wash 30°C in garment bag.', category: cm['leggings'], gender: 'women', sportType: ['lifting', 'yoga', 'training'], tags: ['seamless', 'squat-proof'], basePrice: 50,
    variants: [
      { color: 'Black Marl', colorHex: '#2d2d2d', images: [{ url: img('1518611012118-696072aa579a'), altText: 'Black Leggings', isPrimary: true }], sizes: [{ size: 'XS', sku: 'VTL-BLK-XS', stock: 20 }, { size: 'S', sku: 'VTL-BLK-S', stock: 35 }, { size: 'M', sku: 'VTL-BLK-M', stock: 45 }, { size: 'L', sku: 'VTL-BLK-L', stock: 25 }] },
      { color: 'Dusty Rose', colorHex: '#d4a0a0', images: [{ url: img('1518611012118-696072aa579a'), altText: 'Rose Leggings', isPrimary: true }], sizes: [{ size: 'XS', sku: 'VTL-RSE-XS', stock: 15 }, { size: 'S', sku: 'VTL-RSE-S', stock: 28 }, { size: 'M', sku: 'VTL-RSE-M', stock: 30 }] },
      { color: 'Sage Green', colorHex: '#8fbc8f', images: [{ url: img('1544367567-0f2fcb009e0b'), altText: 'Sage Leggings', isPrimary: true }], sizes: [{ size: 'S', sku: 'VTL-SGE-S', stock: 4 }, { size: 'M', sku: 'VTL-SGE-M', stock: 22 }] },
    ], ratings: { average: 4.9, count: 567 }, isFeatured: true, isTrending: true, isBestSeller: true, totalSold: 4200
  },
  {
    name: 'Flex High Waisted Leggings', slug: 'flex-high-waisted-leggings-women', description: 'Second-skin fit with flattering ribbed texture. Built for every workout.', details: '• 78% Nylon, 22% Elastane\\n• High waisted\\n• Ribbed texture\\n• Squat-proof', careInstructions: 'Machine wash cold in garment bag.', category: cm['leggings'], gender: 'women', sportType: ['lifting', 'training'], tags: ['high-waisted', 'ribbed'], basePrice: 46, salePrice: 36, isSale: true,
    variants: [
      { color: 'Burgundy', colorHex: '#800020', images: [{ url: img('1518310383802-640c2de311b2'), altText: 'Burgundy Flex Leggings', isPrimary: true }], sizes: [{ size: 'XS', sku: 'FHL-BRG-XS', stock: 14 }, { size: 'S', sku: 'FHL-BRG-S', stock: 26 }, { size: 'M', sku: 'FHL-BRG-M', stock: 32 }] },
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1506629082955-511b1aa562c8'), altText: 'Black Flex Leggings', isPrimary: true }], sizes: [{ size: 'S', sku: 'FHL-BLK-S', stock: 30 }, { size: 'M', sku: 'FHL-BLK-M', stock: 40 }, { size: 'L', sku: 'FHL-BLK-L', stock: 22 }] },
    ], ratings: { average: 4.7, count: 321 }, isTrending: true, isBestSeller: true, totalSold: 2800
  },
  {
    name: 'Speed Compression Leggings', slug: 'speed-compression-leggings-women', description: 'High-performance compression leggings for running and HIIT. Reflective details.', details: '• Compression fit\\n• Reflective logos\\n• Hidden waist pocket\\n• 25" inseam', careInstructions: 'Machine wash cold.', category: cm['leggings'], gender: 'women', sportType: ['running', 'training'], tags: ['compression', 'running'], basePrice: 52,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1571019614242-c5c5dee9f50c'), altText: 'Black Compression Leggings', isPrimary: true }], sizes: [{ size: 'XS', sku: 'SCL-BLK-XS', stock: 16 }, { size: 'S', sku: 'SCL-BLK-S', stock: 28 }, { size: 'M', sku: 'SCL-BLK-M', stock: 34 }, { size: 'L', sku: 'SCL-BLK-L', stock: 18 }] },
    ], ratings: { average: 4.6, count: 143 }, isFeatured: true, totalSold: 960
  },
  // ── WOMEN'S SPORTS BRAS (2) ──
  {
    name: 'Adapt Ombre Sports Bra', slug: 'adapt-ombre-sports-bra-women', description: 'Medium support with stunning ombre knit. Removable padding, seamless.', details: '• Seamless knit\\n• Medium support\\n• Removable pads\\n• 90% Nylon, 10% Elastane', careInstructions: 'Hand wash recommended.', category: cm['sports-bras'], gender: 'women', sportType: ['training', 'yoga'], tags: ['sports-bra', 'ombre', 'seamless'], basePrice: 38,
    variants: [
      { color: 'Black/Grey Ombre', colorHex: '#333333', images: [{ url: img('1518310383802-640c2de311b2'), altText: 'Black Ombre Bra', isPrimary: true }], sizes: [{ size: 'XS', sku: 'ADP-BLK-XS', stock: 18 }, { size: 'S', sku: 'ADP-BLK-S', stock: 30 }, { size: 'M', sku: 'ADP-BLK-M', stock: 35 }] },
      { color: 'Berry/Pink', colorHex: '#8b2252', images: [{ url: img('1518611012118-696072aa579a'), altText: 'Berry Ombre Bra', isPrimary: true }], sizes: [{ size: 'S', sku: 'ADP-BRY-S', stock: 22 }, { size: 'M', sku: 'ADP-BRY-M', stock: 28 }] },
    ], ratings: { average: 4.6, count: 289 }, isTrending: true, isBestSeller: true, totalSold: 1850
  },
  {
    name: 'Legacy High Support Bra', slug: 'legacy-high-support-bra-women', description: 'Maximum support for high-impact training. Encapsulated cups with adjustable straps.', details: '• High support\\n• Adjustable straps\\n• Hook-and-eye back\\n• Moisture-wicking', careInstructions: 'Hand wash recommended.', category: cm['sports-bras'], gender: 'women', sportType: ['running', 'training'], tags: ['sports-bra', 'high-support'], basePrice: 44,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1476480862126-209bfaa8edc8'), altText: 'Black Legacy Bra', isPrimary: true }], sizes: [{ size: 'S', sku: 'LGC-BLK-S', stock: 20 }, { size: 'M', sku: 'LGC-BLK-M', stock: 32 }, { size: 'L', sku: 'LGC-BLK-L', stock: 18 }] },
    ], ratings: { average: 4.8, count: 176 }, isFeatured: true, totalSold: 1200
  },
  // ── WOMEN'S TOPS (2) ──
  {
    name: 'Training Crop Top', slug: 'training-crop-top-women', description: 'Lightweight crop top for high-intensity training. Sweat-wicking keeps you cool.', details: '• 85% Polyester, 15% Elastane\\n• Sweat-wicking\\n• Cropped length', careInstructions: 'Machine wash cold.', category: cm['t-shirts-tops'], gender: 'women', sportType: ['training', 'running'], tags: ['crop-top', 'lightweight'], basePrice: 30, salePrice: 22, isSale: true,
    variants: [
      { color: 'White', colorHex: '#ffffff', images: [{ url: img('1515886657613-9f3515b0c78f'), altText: 'White Crop Top', isPrimary: true }], sizes: [{ size: 'XS', sku: 'TCT-WHT-XS', stock: 10 }, { size: 'S', sku: 'TCT-WHT-S', stock: 25 }, { size: 'M', sku: 'TCT-WHT-M', stock: 30 }] },
      { color: 'Dusty Lilac', colorHex: '#c8a2c8', images: [{ url: img('1518611012118-696072aa579a'), altText: 'Lilac Crop Top', isPrimary: true }], sizes: [{ size: 'S', sku: 'TCT-LIL-S', stock: 2 }, { size: 'M', sku: 'TCT-LIL-M', stock: 18 }] },
    ], ratings: { average: 4.3, count: 145 }, totalSold: 620
  },
  {
    name: 'Relaxed Fit Long Sleeve', slug: 'relaxed-long-sleeve-women', description: 'Soft jersey long sleeve with thumbholes. Comfort meets coverage.', details: '• 95% Cotton, 5% Elastane\\n• Relaxed fit\\n• Thumbholes\\n• Curved hem', careInstructions: 'Machine wash 30°C.', category: cm['t-shirts-tops'], gender: 'women', sportType: ['yoga', 'everyday'], tags: ['long-sleeve', 'relaxed'], basePrice: 34,
    variants: [
      { color: 'Cream', colorHex: '#f5f5dc', images: [{ url: img('1544367567-0f2fcb009e0b'), altText: 'Cream Long Sleeve', isPrimary: true }], sizes: [{ size: 'XS', sku: 'RLS-CRM-XS', stock: 14 }, { size: 'S', sku: 'RLS-CRM-S', stock: 22 }, { size: 'M', sku: 'RLS-CRM-M', stock: 28 }] },
    ], ratings: { average: 4.5, count: 98 }, isFeatured: true, totalSold: 520
  },
  // ── WOMEN'S HOODIE & SHORTS (2) ──
  {
    name: 'Rest Day Sweats Hoodie', slug: 'rest-day-hoodie-women', description: 'Ultra-soft oversized hoodie for rest days. Brushed 350gsm heavyweight fleece.', details: '• 80% Cotton, 20% Polyester\\n• 350gsm\\n• Oversized fit\\n• Kangaroo pocket', careInstructions: 'Machine wash 30°C.', category: cm['hoodies-jackets'], gender: 'women', sportType: ['everyday'], tags: ['hoodie', 'rest-day', 'oversized'], basePrice: 56,
    variants: [
      { color: 'Taupe', colorHex: '#b8a99a', images: [{ url: img('1515886657613-9f3515b0c78f'), altText: 'Taupe Hoodie', isPrimary: true }], sizes: [{ size: 'XS', sku: 'RSD-TPE-XS', stock: 12 }, { size: 'S', sku: 'RSD-TPE-S', stock: 25 }, { size: 'M', sku: 'RSD-TPE-M', stock: 30 }, { size: 'L', sku: 'RSD-TPE-L', stock: 18 }] },
      { color: 'Coal', colorHex: '#36454f', images: [{ url: img('1556906781-9a412961c28c'), altText: 'Coal Hoodie', isPrimary: true }], sizes: [{ size: 'S', sku: 'RSD-COL-S', stock: 20 }, { size: 'M', sku: 'RSD-COL-M', stock: 28 }] },
    ], ratings: { average: 4.8, count: 234 }, isFeatured: true, isTrending: true, isBestSeller: true, totalSold: 1680
  },
  {
    name: 'Flex Cycling Shorts', slug: 'flex-cycling-shorts-women', description: 'High-waisted cycling shorts, squat-proof, no front seam. Perfect for lifting.', details: '• 78% Nylon, 22% Elastane\\n• High waisted\\n• 5" inseam\\n• Squat-proof', careInstructions: 'Machine wash cold in garment bag.', category: cm['shorts'], gender: 'women', sportType: ['lifting', 'training'], tags: ['cycling-shorts', 'squat-proof'], basePrice: 34,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1506629082955-511b1aa562c8'), altText: 'Black Cycling Shorts', isPrimary: true }], sizes: [{ size: 'XS', sku: 'FCS-BLK-XS', stock: 15 }, { size: 'S', sku: 'FCS-BLK-S', stock: 32 }, { size: 'M', sku: 'FCS-BLK-M', stock: 40 }, { size: 'L', sku: 'FCS-BLK-L', stock: 22 }] },
    ], ratings: { average: 4.7, count: 201 }, isTrending: true, isBestSeller: true, totalSold: 1340
  },
  // ── ACCESSORIES (2) ──
  {
    name: 'Performance Lifting Gloves', slug: 'performance-lifting-gloves', description: 'Padded palm lifting gloves with wrist support. Grip-tech palm for heavy lifts.', details: '• Synthetic leather palm\\n• Neoprene padding\\n• Adjustable wrist strap\\n• Pull tab', careInstructions: 'Wipe clean after use.', category: cm['accessories'], gender: 'unisex', sportType: ['lifting'], tags: ['gloves', 'accessories'], basePrice: 22,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1583454110551-21f2fa2afe61'), altText: 'Black Lifting Gloves', isPrimary: true }], sizes: [{ size: 'S', sku: 'PLG-BLK-S', stock: 30 }, { size: 'M', sku: 'PLG-BLK-M', stock: 50 }, { size: 'L', sku: 'PLG-BLK-L', stock: 40 }] },
    ], ratings: { average: 4.3, count: 156 }, isBestSeller: true, totalSold: 920
  },
  {
    name: 'RAWTHREAD Gym Bag', slug: 'rawthread-gym-bag', description: 'Spacious barrel gym bag with shoe compartment and multiple pockets. Water-resistant.', details: '• 40L capacity\\n• Shoe compartment\\n• Water-resistant base\\n• Padded shoulder strap', careInstructions: 'Wipe clean with damp cloth.', category: cm['accessories'], gender: 'unisex', sportType: ['everyday', 'training'], tags: ['gym-bag', 'accessories'], basePrice: 45,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1553062407-98d43420e9e7'), altText: 'Black Gym Bag', isPrimary: true }], sizes: [{ size: 'ONE SIZE', sku: 'RGB-BLK-OS', stock: 40 }] },
    ], ratings: { average: 4.6, count: 203 }, isFeatured: true, isTrending: true, totalSold: 1100
  },
  // ── UNDERWEAR (2) ──
  {
    name: 'Sport Performance Boxer', slug: 'sport-performance-boxer-men', description: 'Anti-chafe boxer briefs with moisture-wicking fabric. All-day comfort.', details: '• 90% Polyamide, 10% Elastane\\n• Flatlock seams\\n• No-ride-up\\n• Moisture-wicking', careInstructions: 'Machine wash 30°C.', category: cm['underwear'], gender: 'men', sportType: ['everyday', 'training'], tags: ['boxer', 'underwear'], basePrice: 18,
    variants: [
      { color: 'Black', colorHex: '#1a1a1a', images: [{ url: img('1489987707025-afc232f7ea0f'), altText: 'Black Boxer', isPrimary: true }], sizes: [{ size: 'S', sku: 'SPB-BLK-S', stock: 40 }, { size: 'M', sku: 'SPB-BLK-M', stock: 60 }, { size: 'L', sku: 'SPB-BLK-L', stock: 45 }] },
      { color: 'Grey', colorHex: '#808080', images: [{ url: img('1503341504253-dff4f5657911'), altText: 'Grey Boxer', isPrimary: true }], sizes: [{ size: 'M', sku: 'SPB-GRY-M', stock: 35 }, { size: 'L', sku: 'SPB-GRY-L', stock: 30 }] },
    ], ratings: { average: 4.5, count: 312 }, isBestSeller: true, totalSold: 2400
  },
  {
    name: 'Seamless Thong 3-Pack', slug: 'seamless-thong-3pack-women', description: 'Invisible under leggings. Laser-cut edges, no visible panty lines.', details: '• 85% Nylon, 15% Elastane\\n• Laser-cut edges\\n• Seamless\\n• No VPL', careInstructions: 'Hand wash recommended.', category: cm['underwear'], gender: 'women', sportType: ['everyday'], tags: ['thong', 'seamless', 'multipack'], basePrice: 28,
    variants: [
      { color: 'Black/Nude/Grey', colorHex: '#1a1a1a', images: [{ url: img('1489987707025-afc232f7ea0f'), altText: '3-Pack Thong', isPrimary: true }], sizes: [{ size: 'XS', sku: 'ST3-MIX-XS', stock: 25 }, { size: 'S', sku: 'ST3-MIX-S', stock: 40 }, { size: 'M', sku: 'ST3-MIX-M', stock: 50 }, { size: 'L', sku: 'ST3-MIX-L', stock: 30 }] },
    ], ratings: { average: 4.4, count: 189 }, isTrending: true, totalSold: 1500
  },
  // ── AI CUSTOM PRODUCTS (ADDED) ──
  {
    name: 'Titan Heavyweight Pump Cover', slug: 'titan-pump-cover-men', description: 'The ultimate oversized pump cover. Heavyweight cotton to keep you warm during your warmups, designed to be tossed aside when the pump hits.', details: '• 100% Premium Cotton\n• 350gsm Heavyweight\n• Drop shoulder oversized fit\n• Embroidered RawThread logo', careInstructions: 'Machine wash cold. Hang dry.', category: cm['hoodies-jackets'], gender: 'men', sportType: ['lifting', 'training'], tags: ['pump-cover', 'oversized', 'heavyweight'], basePrice: 58, salePrice: 48, isSale: true,
    variants: [
      { color: 'Washed Black', colorHex: '#252525', images: [{ url: img('1515886657613-9f3515b0c78f'), altText: 'Washed Black Pump Cover', isPrimary: true }], sizes: [{ size: 'M', sku: 'TTN-BLK-M', stock: 50 }, { size: 'L', sku: 'TTN-BLK-L', stock: 60 }, { size: 'XL', sku: 'TTN-BLK-XL', stock: 40 }, { size: 'XXL', sku: 'TTN-BLK-XXL', stock: 15 }] },
      { color: 'Vintage Olive', colorHex: '#4b5320', images: [{ url: img('1556906781-9a412961c28c'), altText: 'Vintage Olive Pump Cover', isPrimary: true }], sizes: [{ size: 'M', sku: 'TTN-OLV-M', stock: 35 }, { size: 'L', sku: 'TTN-OLV-L', stock: 45 }, { size: 'XL', sku: 'TTN-OLV-XL', stock: 20 }] }
    ], ratings: { average: 4.9, count: 412 }, isFeatured: true, isTrending: true, isBestSeller: true, totalSold: 3200
  },
  {
    name: 'Aura Scrunch Bum Leggings', slug: 'aura-scrunch-leggings-women', description: 'Engineered to flatter. The Aura leggings feature a subtle scrunch bum detail and buttery soft fabric that moves flawlessly with your body.', details: '• 80% Nylon, 20% Elastane\n• Buttery soft feel\n• Scrunch bum detailing\n• Ultra high-waisted and squat proof', careInstructions: 'Machine wash cold inside out.', category: cm['leggings'], gender: 'women', sportType: ['lifting', 'yoga'], tags: ['scrunch', 'leggings', 'soft'], basePrice: 54,
    variants: [
      { color: 'Midnight Blue', colorHex: '#191970', images: [{ url: img('1506629082955-511b1aa562c8'), altText: 'Midnight Blue Aura Leggings', isPrimary: true }], sizes: [{ size: 'XS', sku: 'ARA-MID-XS', stock: 25 }, { size: 'S', sku: 'ARA-MID-S', stock: 40 }, { size: 'M', sku: 'ARA-MID-M', stock: 40 }, { size: 'L', sku: 'ARA-MID-L', stock: 20 }] },
      { color: 'Electric Pink', colorHex: '#ff66cc', images: [{ url: img('1518611012118-696072aa579a'), altText: 'Electric Pink Aura Leggings', isPrimary: true }], sizes: [{ size: 'S', sku: 'ARA-PNK-S', stock: 15 }, { size: 'M', sku: 'ARA-PNK-M', stock: 30 }] }
    ], ratings: { average: 4.8, count: 856 }, isTrending: true, isBestSeller: true, totalSold: 5600
  },
  {
    name: 'RawThread Stainless Steel Shaker', slug: 'stainless-shaker-bottle', description: 'Keep your pre-workout crisp and your protein shakes perfectly mixed. Double-walled insulation keeps drinks cold for 24 hours.', details: '• 750ml / 25oz capacity\n• Premium stainless steel\n• Built-in mixing grate\n• Leak-proof lid\n• BPA-Free', careInstructions: 'Hand wash recommended. Do not microwave.', category: cm['accessories'], gender: 'unisex', sportType: ['everyday', 'training', 'lifting'], tags: ['shaker', 'bottle', 'accessories'], basePrice: 26,
    variants: [
      { color: 'Matte Black', colorHex: '#1a1a1a', images: [{ url: img('1583454110551-21f2fa2afe61'), altText: 'Matte Black Shaker', isPrimary: true }], sizes: [{ size: 'ONE SIZE', sku: 'SHK-BLK-OS', stock: 150 }] },
      { color: 'Metallic Silver', colorHex: '#c0c0c0', images: [{ url: img('1553062407-98d43420e9e7'), altText: 'Metallic Silver Shaker', isPrimary: true }], sizes: [{ size: 'ONE SIZE', sku: 'SHK-SLV-OS', stock: 85 }] }
    ], ratings: { average: 4.7, count: 124 }, isFeatured: true, totalSold: 1100
  },
];

const coupons = [
  { code: 'WELCOME10', type: 'percent', value: 10, minOrderAmount: 50, maxUses: 1000, usedCount: 0, isActive: true, expiresAt: new Date('2027-12-31') },
  { code: 'SAVE20', type: 'fixed', value: 20, minOrderAmount: 100, maxUses: 500, usedCount: 0, isActive: true, expiresAt: new Date('2027-06-30') },
  { code: 'SUMMER25', type: 'percent', value: 25, minOrderAmount: 75, maxUses: 200, usedCount: 0, isActive: true, expiresAt: new Date('2027-08-31') },
  { code: 'RAWTHREAD30', type: 'percent', value: 30, minOrderAmount: 120, maxUses: 100, usedCount: 0, isActive: true, expiresAt: new Date('2027-12-31') },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB for seeding...');
    await User.deleteMany({}); await Category.deleteMany({}); await Product.deleteMany({}); await Coupon.deleteMany({});
    console.log('Cleared existing data');
    const admin = await User.create({ firstName: 'Admin', lastName: 'User', email: 'admin@rawthread.com', password: 'admin123456', role: 'admin' });
    console.log(`Admin: ${admin.email} / admin123456`);
    const testUser = await User.create({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password123', role: 'user', addresses: [{ label: 'Home', street: '123 Fitness Street', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'US', isDefault: true }] });
    console.log(`User: ${testUser.email} / password123`);
    const createdCats = await Category.insertMany(categories);
    const cm = {}; createdCats.forEach(c => cm[c.slug] = c._id);
    console.log(`${createdCats.length} categories created`);
    const products = generateProducts(cm);
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);
    await Coupon.insertMany(coupons);
    console.log('\n✅ Database seeded successfully!');
    console.log(`Admin: admin@rawthread.com / admin123456`);
    console.log(`User: john@example.com / password123`);
    console.log(`Coupons: WELCOME10, SAVE20, SUMMER25, RAWTHREAD30`);
    process.exit(0);
  } catch (error) { console.error('Seed error:', error); process.exit(1); }
};
seedDB();
