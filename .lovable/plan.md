## Objectif

Permettre à l'admin de configurer un parfum soit en **décants 5ml / 10ml** (mode actuel), soit en **bouteille complète** (un seul format : volume + prix + stock + badge "édition limitée" optionnel). Côté boutique, ces produits s'affichent sans sélecteur de taille, avec un badge premium, et sont filtrables séparément.

## Changements

### 1. Base de données (migration)
Ajouter à la table `parfums` :
- `sale_mode` (texte, défaut `'decant'`) — `'decant'` ou `'full_bottle'`
- `full_bottle_volume_ml` (entier, nullable) — ex. 50, 100
- `full_bottle_price` (numeric, nullable) — prix MAD
- `full_bottle_stock` (entier, défaut 0)
- `full_bottle_limited` (booléen, défaut false) — affiche un badge "Édition limitée"

Aucun changement RLS ni GRANT (déjà en place).

### 2. Admin — `ProductModal`
- Nouveau toggle en haut : **« Mode de vente : Décants (5/10 ml) ▸ Bouteille complète »**.
- Si **Bouteille complète** : masque les sections Prix 5ml/10ml + Stock 5ml/10ml, affiche :
  - Volume (ml) *
  - Prix bouteille (MAD) *
  - Stock (bouteilles)
  - Switch « Édition limitée »
- Validation adaptée selon le mode.
- `syncParfum.upsertParfumToSupabase` envoie les nouveaux champs.

### 3. Admin — `ProductTable`
- Colonne "Format" qui affiche `5/10 ml` ou `100 ml — Complet` selon `sale_mode`.
- Pour les bouteilles complètes : prix unique et stock unique dans les cartes mobiles.

### 4. Boutique — fiche produit (`ProductDetail`)
- Si `sale_mode === 'full_bottle'` :
  - Pas de sélecteur de format.
  - Bloc « Bouteille complète — 100 ml » + prix MAD.
  - Badge doré « Édition limitée » si activé.
  - Ajout au panier avec une taille `"full"`.
- Sinon comportement actuel inchangé.

### 5. Boutique — page catégorie (`Category.tsx`)
- Nouveau filtre **« Bouteille complète »** dans la barre de filtres (à côté de Homme/Femme/Mixte/Nouveautés).
- Sur les cartes produit : afficher `formatMAD(full_bottle_price)` au lieu de "À partir de … 5ml" et un petit badge `Bouteille complète` si applicable.

### 6. Panier & Checkout
- `Size` type étendu à `"5ml" | "10ml" | "20ml" | "full"`.
- `SIZE_META.full = { label: "Bouteille complète", sub: "Flacon scellé" }`.
- `priceFor` gère `"full"` (renvoie `full_bottle_price`).
- `ShoppingBag` et `Checkout` affichent le format complet sans modification de logique.

### 7. Edge function `create-order`
- Accepter `size: "full"`.
- Si `"full"` : utiliser `full_bottle_price`, vérifier `full_bottle_stock > 0`, libellé "Bouteille complète (Xml)".

## Pas de régression
Tous les produits existants conservent `sale_mode = 'decant'` par défaut → aucun changement visible pour eux.

## Notes
Le décrément de stock à la commande n'est actuellement pas implémenté côté serveur ; ce comportement est conservé tel quel. On vérifie seulement que le produit n'est pas en rupture.