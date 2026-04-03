# Guide Frontend API

Ce document est une vue d'integration pour le frontend. Il ne remplace pas la spec OpenAPI, mais il indique quels endpoints utiliser, dans quel ordre, et quels points d'attention respecter.

## Langue des messages API

- Les messages de reponse exposes au frontend (`detail`, `error`, `message`) sont maintenant rediges en francais.
- Le frontend ne doit pas faire de logique metier sur le texte exact de ces messages.
- Utiliser en priorite le code HTTP, la presence des cles (`detail`, `error`, `message`) et les champs de statut metier (`status`, `overdue_status`, etc.).
- Pour l'affichage UI, considerer ces messages comme des textes prets a afficher ou a mapper vers une traduction frontend si necessaire.

## Politique devise (currency)

- Tous les montants monetaires exposent desormais un champ `currency` ou heritent d'une devise metier.
- `Property.currency` est la devise de reference d'un bien.
- `Unit.currency` doit correspondre a `Property.currency`.
- `Lease.currency` est alignee automatiquement sur `Unit.currency`.
- `Payment.currency` est alignee automatiquement sur `Lease.currency`.
- `PaymentScheduleItem.currency` est alignee automatiquement sur `Lease.currency`.
- `Discount.currency` est alignee automatiquement sur le `unit` ou `lease` cible.
- `EmploymentInfo.currency` indique la devise de `gross_income`.

## Base URL

- Local: `http://localhost:8000`
- Prefix API: `/api`

## Authentification

### 1. Inscription par telephone

Endpoint:

- `POST /api/accounts/users/`

Payload minimal:

```json
{
  "phone_number": "+2507XXXXXXXX",
  "password": "StrongPassword123",
  "password2": "StrongPassword123",
  "role": "landlord"
}
```

Roles supportes:

- `landlord`
- `tenant`
- `property_manager`
- `admin`

### 2. Login mot de passe

Endpoint canonique:

- `POST /api/auth/login/`

Payload:

```json
{
  "phone_number": "+2507XXXXXXXX",
  "password": "StrongPassword123"
}
```

Response:

```json
{
  "access": "<jwt-access>",
  "refresh": "<jwt-refresh>"
}
```

### 3.b Etat OTP actuel (important)

Statut actuel backend:

- Le flow OTP existe bien (`/api/auth/otp/request/` + `/api/auth/otp/verify/`).
- L'integration provider SMS n'est pas encore branchée en production.
- En attendant, le code OTP est affiche dans la console du serveur en environnement dev (`DEBUG=True`).
- Les tenants peuvent aussi se connecter par mot de passe via `/api/auth/login/`.

### 3. Login OTP

Endpoints canoniques:

- `POST /api/auth/otp/request/`
- `POST /api/auth/otp/verify/`

Request OTP:

```json
{
  "phone_number": "+2507XXXXXXXX"
}
```

Verify OTP:

```json
{
  "phone_number": "+2507XXXXXXXX",
  "code": "123456"
}
```

Response:

```json
{
  "access": "<jwt-access>",
  "refresh": "<jwt-refresh>"
}
```

### 4. Refresh token

- `POST /api/auth/refresh/`

```json
{
  "refresh": "<jwt-refresh>"
}
```

### 5. Header a envoyer

```http
Authorization: Bearer <access-token>
```

### 6. Introspection HEAD (metadonnees des routes)

Le backend supporte `HEAD` sur les routes API exposees par les viewsets (accounts, properties, tenants, leases, payments).

But:

- Recuperer la definition des champs de `create` et `update`
- Recuperer les colonnes de `list`
- Recuperer les champs de `detail`

Exemple:

- `HEAD /api/tenants/profiles/`

Headers retournes:

- `X-Route-Action`: action resolue (`list`, `retrieve`, etc.)
- `X-Create-Fields`: JSON array des champs de creation
- `X-Update-Fields`: JSON array des champs de mise a jour
- `X-List-Columns`: JSON array des colonnes de liste
- `X-Detail-Fields`: JSON array des champs detail

Format d'un item `X-Create-Fields` / `X-Update-Fields`:

```json
{
  "name": "alternate_phone",
  "type": "CharField",
  "required": false,
  "read_only": false
}
```

Notes frontend:

- Les valeurs sont des JSON strings dans les headers HTTP: faire `JSON.parse(...)`
- Ces headers sont exposes en CORS via `Access-Control-Expose-Headers`
- Un `401` peut arriver sans token, mais les headers d'introspection restent disponibles

## Convention importante sur les IDs

- `User.id`: entier
- Presque tous les autres objets metier: UUID string

Exemples:

- `user.id` -> `12`
- `property.id` -> `"3f6d3d84-3d1e-4d76-9f69-7f6f9cbf8abc"`
- `unit.id` -> `"d2e5..."`
- `lease.id` -> `"a8b1..."`
- `payment.id` -> `"c3aa..."`

Le frontend doit donc traiter les IDs metier comme des chaines.

## Recuperer le profil courant

- `GET /api/accounts/users/me/`
- `GET /api/accounts/users/shell_profile/`

Usage frontend:

- recuperer le role apres login
- router vers dashboard bailleur ou locataire
- afficher le profil courant
- alimenter le header/shell (nom, role, unread notifications)

## Flows frontend par domaine

### A. Landlord dashboard

#### Proprietes

- `GET /api/properties/properties/` — liste paginee
- `POST /api/properties/properties/` — creer
- `GET /api/properties/properties/{id}/` — detail complet
- `GET /api/properties/properties/{id}/enriched/` — detail enrichi
- `PATCH /api/properties/properties/{id}/` — modifier
- `POST /api/properties/properties/{id}/activate/`
- `POST /api/properties/properties/{id}/deactivate/`
- `GET /api/properties/properties/{id}/financials/`
- `GET /api/properties/properties/{id}/statistics/`

Note `financials`:

- La reponse inclut `currency` pour interpreter `monthly_rent_total`, `purchase_price` et `current_value`.

**Reponse liste (`GET /api/properties/properties/`):**

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "1c96780c-4273-4e28-92b0-ed46b15a7c65",
      "name": "hello word",
      "property_type": "apartment",
      "status": "active",
      "landlord_name": "Prenom Nom",
      "total_units": 3,
      "manager_count": 0,
      "monthly_rent_total": null,
      "currency": "CDF",
      "is_active": true,
      "created_at": "2026-04-02T12:13:06.961783Z",
      "updated_at": "2026-04-02T12:13:06.961795Z"
    }
  ]
}
```

Filtres disponibles sur la liste:

- `?status=active|inactive|maintenance|sold`
- `?property_type=apartment|house|condo|townhouse|commercial|other`
- `?city=kinshasa`
- `?country=RD+CONGO`
- `?search=<texte>` — cherche dans `name`, `address_content`, `city`, `description`
- `?ordering=created_at|-created_at|name`

**Payload creation (`POST /api/properties/properties/`):**

```json
{
  "name": "Ma propriete",
  "property_type": "apartment",
  "address_content": "1 Avenue Kasa-Vubu",
  "city": "kinshasa",
  "country": "RD CONGO",
  "description": "...",
  "total_units": 4,
  "currency": "CDF"
}
```

Champs modele `Property` (create/update):

| Champ             | Type    | Requis | Notes                                                             |
| ----------------- | ------- | ------ | ----------------------------------------------------------------- |
| `name`            | string  | oui    |                                                                   |
| `property_type`   | enum    | non    | `apartment \| house \| condo \| townhouse \| commercial \| other` |
| `status`          | enum    | non    | `active \| inactive \| maintenance \| sold`                       |
| `address_content` | string  | oui    | remplace les anciens champs `address_line_1/state/postal_code`    |
| `city`            | enum    | non    | actuellement `kinshasa` uniquement                                |
| `country`         | string  | non    | defaut `RD CONGO`                                                 |
| `description`     | string  | non    |                                                                   |
| `total_units`     | integer | non    | defaut 1                                                          |
| `currency`        | string  | non    | `CDF \| USD \| EUR` (defaut `CDF`)                              |

`enriched` renvoie en plus:

- amenities
- facilities
- media_gallery
- branding (tier, brand assets)

#### Managers de propriete

- `POST /api/properties/properties/{id}/assign_manager/`
- `GET /api/properties/properties/{id}/managers/`
- `GET /api/properties/managers/`
- `PATCH /api/properties/managers/{id}/`
- `POST /api/properties/managers/{id}/update_permissions/`
- `POST /api/properties/managers/{id}/remove/`

#### Unites

- `GET /api/properties/units/` — liste
- `POST /api/properties/units/` — creer
- `GET /api/properties/units/{id}/` — detail complet
- `PATCH /api/properties/units/{id}/` — modifier
- `POST /api/properties/units/{id}/activate/`
- `POST /api/properties/units/{id}/deactivate/`
- `POST /api/properties/units/{id}/update_status/`
- `GET /api/properties/units/available/?property_id=<property_uuid>`

**Reponse liste / creation (`GET` + `POST /api/properties/units/`):**

```json
{
  "id": "<uuid>",
  "property": "<property_uuid>",
  "unit_number": "101",
  "unit_type": "1br",
  "status": "vacant",
  "rent": "450.00",
  "currency": "USD",
  "rental_periodicity": "mensuel",
  "description": "Beau studio lumineux",
  "is_furnished": false,
  "is_active": true,
  "created_at": "2026-04-02T12:00:00Z",
  "updated_at": "2026-04-02T12:00:00Z"
}
```

Champs pour `POST /api/properties/units/` (creation simple):

| Champ                              | Type    | Requis | Notes                                                       |
| ---------------------------------- | ------- | ------ | ----------------------------------------------------------- |
| `unit_number`                      | string  | oui    | unique par propriete                                        |
| `unit_type`                        | enum    | non    | `studio \| 1br \| 2br \| 3br \| 4br \| commercial \| other` |
| `rent`                             | decimal | oui    | montant du loyer                                            |
| `currency`                         | string  | non    | `CDF \| USD \| EUR` (defaut: devise du bien)              |
| `rental_periodicity`               | enum    | non    | `journ \| hebdo \| mensuel \| autre` — defaut `mensuel`     |
| `security_deposit`                 | decimal | non    | montant de garantie demande                                 |
| `security_deposit_months_required` | integer | non    | nombre de mois de garantie requis (defaut `0`)              |
| `description`                      | string  | non    |                                                             |
| `is_furnished`                     | boolean | non    | defaut `false`                                              |

Filtres disponibles sur la liste:

- `?status=vacant|occupied|maintenance|reserved`
- `?unit_type=studio|1br|2br|3br|4br|commercial|other`
- `?is_furnished=true|false`

**Detail (`GET /api/properties/units/{id}/`)** — inclut en plus les champs physiques et financiers:

- `bedrooms`, `bathrooms`, `square_footage`, `floor_number`
- `security_deposit`, `security_deposit_months_required`, `booking_deposit`
- `allowed_payment_methods`
- `advance_payment_policy_text`
- `current_tenant`, `current_lease`

Notes devise (units):

- Si `currency` n'est pas fourni a la creation d'unite, le backend utilise `Property.currency`.
- Si `currency` est fourni avec une devise differente de `Property.currency`, la requete est rejetee.

#### Metadonnees propriete (amenities/facilities/media/branding)

- `GET|POST /api/properties/amenities/`
- `GET|PATCH|DELETE /api/properties/amenities/{id}/`
- `GET|POST /api/properties/facilities/`
- `GET|PATCH|DELETE /api/properties/facilities/{id}/`
- `GET|POST /api/properties/media-assets/`
- `GET|PATCH|DELETE /api/properties/media-assets/{id}/`
- `GET|POST /api/properties/branding/`
- `GET|PATCH|DELETE /api/properties/branding/{id}/`

### B. Tenant management

#### Dashboard tenant

- `GET /api/tenants/dashboard/`
- `PATCH /api/tenants/dashboard/config/`

Le dashboard expose notamment:

- `residence_image`
- `hero_banner`
- `automatic_payments_enabled`
- `next_due_payment`
- `quick_stats`

#### Notifications tenant

- `GET /api/tenants/notifications/`
- `GET /api/tenants/notifications/{id}/`
- `POST /api/tenants/notifications/{id}/mark_read/`
- `POST /api/tenants/notifications/mark_all_read/`

Filtre utile:

- `GET /api/tenants/notifications/?unread=true`

#### Comptes utilisateurs

- `POST /api/accounts/users/` pour créer un landlord, property manager ou admin.

> **Note :** Ne pas utiliser cet endpoint pour créer un tenant. Utiliser directement
> `POST /api/tenants/profiles/` — il crée l'utilisateur et le profil en une seule requête.

#### Profils locataires

- `GET /api/tenants/profiles/`
- `POST /api/tenants/profiles/`
- `GET /api/tenants/profiles/{id}/`
- `PATCH /api/tenants/profiles/{id}/`
- `GET /api/tenants/profiles/{id}/statistics/`

**Champs pour `POST /api/tenants/profiles/` et `PATCH /api/tenants/profiles/{id}/`**

> `POST /api/tenants/profiles/` crée automatiquement un `User` (rôle `tenant`) dont le
> `phone_number` est la valeur de `alternate_phone`. Le locataire peut ensuite se connecter
> via OTP avec ce numéro. Aucun appel préalable à `POST /api/accounts/users/` n'est nécessaire.

| Champ               | Type    | POST            | PATCH     | Description                                                                                        |
| ------------------- | ------- | --------------- | --------- | -------------------------------------------------------------------------------------------------- |
| `alternate_phone`   | string  | **obligatoire** | optionnel | Numéro du locataire — devient `User.phone_number` à la création (max 15 chars)                     |
| `id_card`           | file    | optionnel       | optionnel | Pièce d'identité (multipart/form-data)                                                             |
| `alternate_email`   | email   | optionnel       | optionnel | Adresse e-mail alternative                                                                         |
| `marital_status`    | enum    | optionnel       | optionnel | `single` \| `married` \| `divorced` \| `widowed` \| `separated`                                    |
| `employment_status` | enum    | optionnel       | optionnel | `employed` \| `self_employed` \| `unemployed` \| `student` \| `retired` \| `military` \| `officer` |
| `notes`             | string  | optionnel       | optionnel | Notes libres                                                                                       |
| `is_active`         | boolean | —               | optionnel | Actif / inactif (PATCH seulement)                                                                  |

#### Contacts / emploi / references

- `GET|POST /api/tenants/emergency-contacts/`
- `GET|PATCH|DELETE /api/tenants/emergency-contacts/{id}/`
- `POST /api/tenants/emergency-contacts/{id}/set_primary/`
- `GET|POST /api/tenants/employment-info/`
- `GET|PATCH|DELETE /api/tenants/employment-info/{id}/`
- `POST /api/tenants/employment-info/{id}/set_current/`
- `GET|POST /api/tenants/references/`
- `GET|PATCH|DELETE /api/tenants/references/{id}/`
- `POST /api/tenants/references/{id}/verify/`
- `POST /api/tenants/references/{id}/unverify/`

Note devise (employment-info):

- Le champ `currency` accompagne `gross_income` dans les endpoints emploi.

### C. Booking flow

#### Creer une reservation (tenant)

- `POST /api/leases/bookings/`

Payload type:

```json
{
  "unit": "<unit_uuid>",
  "check_in": "2026-04-10",
  "check_out": "2026-05-10",
  "preferred_move_in_time": "morning",
  "occupants_count": 2,
  "adults_count": 2,
  "children_count": 0,
  "has_pets": false,
  "pet_details": "",
  "monthly_income_estimate": "1200.00",
  "monthly_income_currency": "CDF",
  "employment_status_snapshot": "employed",
  "emergency_contact_name": "John Doe",
  "emergency_contact_phone": "+2507XXXXXXXX",
  "id_document_url": "https://...",
  "selfie_url": "https://...",
  "stay_purpose": "Long term rental",
  "special_requests": "Near entrance",
  "source_channel": "mobile_app",
  "booking_deposit": "50.00",
  "booking_deposit_currency": "CDF",
  "notes": "Je souhaite reserver cette unite"
}
```

Le backend affecte automatiquement `tenant = request.user`.

Notes devise (booking):

- `booking_deposit_currency` est forcee sur la devise de l'unite lorsque `booking_deposit` est fourni.
- `monthly_income_currency` represente la devise du revenu estime fourni par le locataire.

#### Lister les reservations

- `GET /api/leases/bookings/`

Comportement:

- tenant: voit ses reservations
- landlord: voit les reservations des unites de ses proprietes
- property_manager: voit les reservations dans son scope

#### Actions sur reservation

- `POST /api/leases/bookings/{id}/confirm/`
- `POST /api/leases/bookings/{id}/reject/`
- `POST /api/leases/bookings/{id}/cancel/`
- `POST /api/leases/bookings/{id}/assess/` (landlord/property manager)

Notes frontend:

- `confirm` cree automatiquement un `Lease` en statut `draft`
- `reject` accepte un champ `reason`
- `cancel` est possible pour tenant ou manager selon le scope

### D. Leases

- `GET /api/leases/leases/`
- `POST /api/leases/leases/`
- `GET /api/leases/leases/{id}/`
- `PATCH /api/leases/leases/{id}/`
- `POST /api/leases/leases/{id}/activate/`
- `POST /api/leases/leases/{id}/terminate/`
- `POST /api/leases/leases/{id}/renew/`
- `GET /api/leases/leases/{id}/payment_schedule/`
- `POST /api/leases/leases/{id}/regenerate_schedule/`

Note `payment_schedule`:

- Chaque item de l'echeancier contient `amount` et `currency`.
- Lors de `regenerate_schedule`, la devise est automatiquement celle du bail (`lease.currency`).

Champs garantie a retenir:

- `security_deposit`: montant de garantie pour le bail
- `security_deposit_months_taken`: nombre de mois effectivement pris au locataire pour ce bail
- si `security_deposit_months_taken` n'est pas fourni a la creation, le backend reprend automatiquement `unit.security_deposit_months_required`

Champs devise:

- `currency`: devise du bail (`CDF \| USD \| EUR`), alignee automatiquement sur la devise de l'unite.

Champs de periodicite de paiement (contrat):

- `payment_frequency`: periodicite de facturation du bail
- valeurs supportees: `monthly`, `quarterly`, `semi_annual`, `annual`
- valeur par defaut: `monthly`

#### Documents de bail

- `GET|POST /api/leases/documents/`
- `GET|PATCH|DELETE /api/leases/documents/{id}/`

Statuts:

- `draft`
- `active`
- `terminated`
- `expired`

Actions:

- `activate`: passe le bail a `active` et l'unite a `occupied`
- `terminate`: passe le bail a `terminated` et l'unite a `vacant`
- `renew`: met a jour `end_date`

### E. Discounts

- `GET /api/leases/discounts/`
- `POST /api/leases/discounts/`
- `GET /api/leases/discounts/{id}/`
- `PATCH /api/leases/discounts/{id}/`
- `DELETE /api/leases/discounts/{id}/`

Deux modes:

- global sur une unite: renseigner `unit`
- par locataire / bail: renseigner `lease`

Payload type:

```json
{
  "name": "Promo Avril",
  "discount_type": "percent",
  "value": "10.00",
  "currency": "CDF",
  "scope": "global",
  "unit": "<unit_uuid>",
  "valid_from": "2026-04-01",
  "valid_until": "2026-04-30",
  "is_active": true
}
```

Notes devise (discount):

- Pour `discount_type="amount"`, `currency` est renseignee selon la devise de l'unite ou du bail cible.
- Si `currency` est envoyee mais differente de la cible (`unit`/`lease`), le backend realigne la valeur sur la devise metier cible.

### F. Payments

- `GET /api/payments/payments/`
- `POST /api/payments/payments/`
- `GET /api/payments/payments/{id}/`
- `PATCH /api/payments/payments/{id}/`
- `POST /api/payments/payments/{id}/confirm/`
- `GET /api/payments/payments/overdue/`
- `GET /api/payments/payments/summary/`
- `POST /api/payments/payments/{id}/generate_link/`
- `POST /api/payments/payments/send_reminders/`

**Note importante:** L'API expose le champ tenant comme `tenant_id` (UUID du locataire).
Lors de la creation d'un paiement, **ne pas envoyer `tenant_id`**: le backend le deduit automatiquement a partir du `lease` (locataire du bail).
Si `tenant_id` est envoye et ne correspond pas au locataire du bail, la requete est rejetee.

Regle metier montant/contrat:

- le montant du paiement est calcule automatiquement a partir du bail (`lease`)
- formule: `amount = lease.monthly_rent * nombre_de_mois(payment_frequency)`
- mapping periodicite -> mois:
  - `monthly` -> `1`
  - `quarterly` -> `3`
  - `semi_annual` -> `6`
  - `annual` -> `12`
- si un `amount` est envoye par le frontend, le backend applique quand meme le montant calcule

Regle metier devise/contrat:

- `currency` est derivee du bail (`lease.currency`) a la creation/mise a jour d'un paiement.
- En pratique, le frontend doit traiter `currency` comme un champ pilote par le backend pour `Payment`.

Libelle de periode du paiement:

- champ `payment_label`: auto-genere au format "Paiement du YYYY-MM-DD au YYYY-MM-DD"
- date de debut = `due_date`
- date de fin = `due_date` + periodicite du bail - 1 jour
- exemple: si `payment_frequency="quarterly"` et `due_date="2026-04-01"`, alors `payment_label="Paiement du 2026-04-01 au 2026-06-30"`
- le champ est en lecture seule (auto-genere a chaque save)

#### Templates de reminder

- `GET|POST /api/payments/reminder-templates/`
- `GET|PATCH|DELETE /api/payments/reminder-templates/{id}/`

#### Generer un lien de paiement

Endpoint:

- `POST /api/payments/payments/{id}/generate_link/`

Payload:

```json
{
  "gateway": "cash",
  "expires_in_hours": 48
}
```

Gateways actuellement supportes par le backend:

- `cash`
- `bank_transfer`
- `easypay`

Response utile au frontend:

```json
{
  "id": "<uuid>",
  "payment": "<payment_uuid>",
  "token": "<uuid>",
  "amount": "100.00",
  "gateway": "cash",
  "status": "active",
  "expires_at": "2026-04-03T10:00:00Z",
  "gateway_url": "",
  "gateway_reference": "",
  "link_url": "http://localhost:8000/pay/<token>/",
  "created_at": "2026-04-01T10:00:00Z"
}
```

Notes frontend:

- `link_url` est la valeur a afficher/copier/partager
- `gateway_url` sera surtout utile quand EasyPay sera cable
- `callback/{token}` est reserve au provider de paiement, pas au frontend

#### Summary payments

- `GET /api/payments/payments/summary/`

Response:

```json
{
  "total_paid": 1200,
  "total_pending": 300,
  "total_overdue": 100,
  "count_paid": 8,
  "count_pending": 2,
  "count_overdue": 1
}
```

#### Lancer un paiement via EasyPay (Tenant)

Flux complet pour un tenant:

1. Obtenir la liste des paiements en attente:
   - `GET /api/payments/payments/` -> filtre sur tenant courant automatiquement

2. Initier la collection EasyPay sur un paiement:
   - `POST /api/payments/payments/{id}/initiate_easypay/`
   - Payload: `{"phone_number": "+243899090907"}` (numéro du tenant)
    - Response: inclut `payment` + `payment_link`
    - Les operations EasyPay (initiation, callback, status checks) sont historisees dans `payment_link.metadata`
   - Le backend appelle l'API EasyPay qui contacte le tenant sur son téléphone

3. EasyPay envoie une requête au tenant (SMS/USSD) pour valider/rejeter:
   - Le tenant répond via son opérateur mobile
   - EasyPay envoie un callback au serveur (webhook)

4. Vérifier le statut du paiement:
   - `GET /api/payments/payments/{id}/check_easypay_status/`
   - Response: Payment + `easypay_status`
   - Si EasyPay retourne `Success`, le backend met a jour la table `Payment` (status `paid`, refs transaction)
   - Si EasyPay retourne `Failed`, le backend enregistre l'echec dans `payment_link.metadata` mais garde le `Payment` en `pending`

Reponse exemple apres initiate_easypay:

```json
{
  "message": "Paiement initie avec succes.",
  "payment": {
    "id": "<uuid>",
    "lease": "<lease_uuid>",
    "tenant_id": "<user_id>",
    "amount": "100.00",
    "currency": "CDF",
    "due_date": "2026-04-05",
    "payment_label": "Paiement du 2026-04-01 au 2026-04-30",
    "status": "pending",
    "payment_method": "bank_transfer",
    "paid_at": null
  },
  "payment_link": {
    "id": "<payment_link_uuid>",
    "payment": "<uuid>",
    "token": "<token>",
    "gateway": "easypay",
    "status": "active",
    "gateway_reference": "REF123456789",
    "metadata": {
      "last_easypay_phone_number": "+243899090907",
      "last_reference_id": "REF123456789",
      "easypay_operations": [
        {
          "type": "initiate",
          "success": true
        }
      ]
    }
  }
}
```

## Ecrans frontend recommandes

### Landlord

- Login / OTP
- Dashboard stats
- Liste proprietes
- Detail propriete
- Gestion unites
- Gestion managers
- Liste bookings a valider
- Liste leases
- Liste paiements
- Paiements en retard
- Creation et partage de lien de paiement
- Gestion des reductions

### Tenant

- Login OTP
- Profil courant
- Dashboard tenant
- Notifications
- Liste des reservations
- Liste des baux
- Liste des paiements
- Detail paiement / lien recu

## Codes d'erreur a gerer cote frontend

- `400`: erreur metier ou validation
- `401`: token absent/invalide/expire
- `403`: utilisateur authentifie mais non autorise
- `404`: ressource introuvable

Patterns de reponse d'erreur observes:

```json
{ "detail": "Code OTP invalide." }
```

ou

```json
{ "error": "Paiement introuvable." }
```

Le frontend doit donc tolerer les deux formes: `detail` et `error`.
Le frontend doit aussi partir du principe que ces messages sont en francais cote backend.

## Points d'attention frontend

1. Utiliser `/api/auth/otp/*` comme routes OTP canoniques. Il existe aussi des routes dupliquees sous `/api/accounts/otp/*`, mais elles ne doivent pas etre la reference principale.
2. Les ressources metier utilisent des UUID, pas des entiers.
3. `rent` represente le montant associe a `rental_periodicity` (mensuel, hebdo, journ, autre). Ne pas supposer que c'est toujours mensuel.
4. `Booking.confirm` ne rend pas le `Lease` directement separement, mais la reservation mise a jour avec son champ `lease` rempli.
5. Le webhook `POST /api/payments/payments/callback/{token}/` n'est pas destine a l'application frontend.
6. Le suivi EasyPay est maintenant centre sur `PaymentLink`: operations historisees dans `payment_link.metadata` et mise a jour de `Payment` uniquement en cas de succes (`Success`).
7. Le modele `Property` a change: utiliser `address_content` + `city` + `country` au lieu des anciens champs (`address_line_1`, `state`, `postal_code`, etc.) dans les formulaires frontend.

## Sequence recommandee pour le frontend

### Landlord

1. Login
2. `GET /api/accounts/users/shell_profile/`
3. `GET /api/properties/properties/`
4. `GET /api/payments/payments/summary/`
5. `GET /api/leases/bookings/` pour les reservations en attente

### Tenant

1. OTP request
2. OTP verify
3. `GET /api/accounts/users/shell_profile/`
4. `GET /api/tenants/dashboard/`
5. `GET /api/tenants/notifications/?unread=true`
6. `GET /api/leases/bookings/`
7. `GET /api/leases/leases/`
8. `GET /api/payments/payments/`

### F. Easypay (Paiements par mobile money)

**Endpoints Easypay:**

- `POST /api/payments/payments/{id}/initiate-easypay/` — initier une collecte Easypay
- `GET /api/payments/payments/{id}/check-easypay-status/` — verifier le statut du paiement
- `POST /api/payments/payments/{id}/initiate_easypay/` — action viewset (meme endpoint)
- `GET /api/payments/payments/{id}/check_easypay_status/` — action viewset
- `POST /api/payments/easypay/callback/` — webhook callback (AllowAny) pour notifications Easypay

**Initier un paiement Easypay:**

```http
POST /api/payments/payments/{payment_uuid}/initiate-easypay/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "phone_number": "+243899090907"
}
```

Response (en cas de succes):

```json
{
  "message": "Paiement initie avec succes.",
  "payment": {
    "id": "<payment_uuid>",
    "status": "pending",
    "amount": "2000.00",
    "currency": "CDF",
    "payment_method": "bank_transfer",
    ...
  },
  "payment_link": {
    "id": "<payment_link_uuid>",
    "token": "<token>",
    "gateway": "easypay",
    "status": "active",
    "gateway_reference": "abc123def456xyz",
    "metadata": {
      "last_easypay_phone_number": "+243899090907",
      "easypay_operations": [
        {
          "type": "initiate",
          "success": true
        }
      ]
    }
  }
}
```

**Verifier le statut (polling):**

```http
GET /api/payments/payments/{payment_uuid}/check-easypay-status/
Authorization: Bearer <access_token>
```

Response:

```json
{
  "status": "success",
  "payment": { ... },
  "easypay_status": {
    "status": "Success",  // ou "Failed" ou "Pending"
    "transactionId": "TX-4C90-4C93-2705",
    "amount": 2000,
    "currency": "CDF",
    "date": "2025-01-27 10:49:20",
    "provider": "Orange Money",
    ...
  }
}
```

**Flow de paiement Easypay:**

1. Frontend: appel `POST /initiate-easypay/` avec le numero de telephone du tenant
2. Backend: genere une reference, l'attache au `PaymentLink`, puis envoie la collecte via API Easypay
3. Backend: retourne le `payment` + le `payment_link` (avec `gateway_reference` et metadata)
4. Easypay: initie l'interaction USSD/mobile money avec le client
5. Client: complete le paiement sur son telephone
6. Easypay: envoie un callback au backend (`POST /api/payments/easypay/callback/`)
7. Backend: enregistre l'operation dans `PaymentLink.metadata`; met a jour `Payment` uniquement si statut `Success`
8. Si callback/statut EasyPay est `Failed`, le `Payment` reste `pending` (nouvelle tentative possible)
9. **Alternative polling:** Frontend peut periodiquement appeler `check-easypay-status/` pour verifier

**Configuration Easypay côte backend:**

Les variables d'environnement suivantes doivent etre definies:

```bash
EASYPAY_API_KEY=your-easypay-api-key
EASYPAY_BASE_URL=https://www.easypay-gateway.com/payments/api/v1
EASYPAY_CALLBACK_URL=https://your-domain.com/api/payments/easypay/callback/
```

**Status de paiement avec Easypay:**

| Statut    | Signification                               |
| --------- | ------------------------------------------- |
| `pending` | Paiement initie, en attente de confirmation |
| `paid`    | Paiement confirme avec succes EasyPay       |

Note devise (EasyPay):

- Les appels EasyPay utilisent `payment.currency` pour initier la collecte et verifier les statuts.

Note metier importante:

- Un echec EasyPay est un echec d'operation gateway, pas un echec definitif du `Payment`.
- Les echecs sont historises dans `payment_link.metadata.easypay_operations`.
- Le `Payment` passe a `paid` uniquement en cas de succes (`Success`).

**Tache automatique:**

Une tache Celery `check_pending_easypay_payments` s'execute toutes les 5 minutes pour verifier les statuts des paiements en attente et les mettre a jour automatiquement. Cela garantit que meme si le callback Easypay est manque, les statuts seront synchronises.

**Phone numbers de test (Easypay sandbox):**

```
243898900000  // success
Tout autre numero // failed
```

## Suivi des retards de paiement (Lease overdue tracking)

### Contexte

Chaque bail (`Lease`) dispose d'un systeme de suivi automatique des retards de paiement. Le backend compare les paiements attendus (definis par les termcs du bail et la frequence de paiement) avec les paiements reellement recus.

### Endpoints pour consulter les retards

#### 1. Obtenir le statut de retard pour un bail (Landlord/Tenant)

```http
GET /api/leases/leases/{lease_id}/overdue_status/
Authorization: Bearer <access_token>
```

Response:

```json
{
  "lease_id": "<lease_uuid>",
  "lease_number": "LEASE-001",
  "overdue_status": "overdue",
  "days_overdue": 15,
  "overdue_amount": "50000.00",
  "currency": "CDF",
  "missed_payment_count": 1,
  "last_overdue_alert_sent_at": null
}
```

**Champs returnees:**

| Champ                      | Type      | Description                                              |
| -------------------------- | --------- | -------------------------------------------------------- |
| `lease_id`                 | UUID      | Identifiant du bail                                      |
| `lease_number`             | string    | Numero du bail (ex: LEASE-001)                           |
| `overdue_status`           | enum      | `on_track` \| `overdue` \| `severely_overdue` \| `resolved` |
| `days_overdue`             | int       | Nombre de jours de retard (0 si a jour)                 |
| `overdue_amount`           | decimal   | Montant total en retard                                 |
| `currency`                 | string    | Devise associee au bail (`CDF \| USD \| EUR`)          |
| `missed_payment_count`     | int       | Nombre de paiements manques                              |
| `last_overdue_alert_sent_at` | datetime | Moment du dernier alerte envoye (null si aucun)        |

**Enum `overdue_status`:**

- `on_track`: Aucun retard, paiements conformes
- `overdue`: Retard < 30 jours
- `severely_overdue`: Retard >= 30 jours
- `resolved`: Retard resolu (ancien statut, maintenant a jour)

#### 2. Resume des retards dans le portefeuille (Landlord/PropertyManager)

```http
GET /api/leases/leases/overdue_summary/
Authorization: Bearer <access_token>
```

Response:

```json
{
  "count_overdue": 2,
  "total_overdue_amount": null,
  "total_overdue_by_currency": {
    "CDF": "50000.00",
    "USD": "100.00"
  },
  "leases": [
    {
      "id": "<lease_uuid_1>",
      "lease_number": "LEASE-001",
      "overdue_status": "overdue",
      "days_overdue": 15,
      "overdue_amount": "50000.00",
      "currency": "CDF",
      ...
    },
    {
      "id": "<lease_uuid_2>",
      "lease_number": "LEASE-003",
      "overdue_status": "severely_overdue",
      "days_overdue": 45,
      "overdue_amount": "100000.00",
      "currency": "USD",
      ...
    }
  ]
}
```

Interpretation de `overdue_summary`:

- `total_overdue_by_currency` est la source fiable pour les agrégats multi-devise.
- `total_overdue_amount` est renseigne seulement s'il n'y a qu'une seule devise dans le scope, sinon `null`.

### Endpoints pour envoyer des alertes

#### 1. Envoyer une alerte de retard (Landlord/PropertyManager only)

```http
POST /api/leases/leases/{lease_id}/alert_overdue/
Authorization: Bearer <access_token>
Content-Type: application/json
```

Payload (optionnel):

```json
{}
```

Response:

```json
{
  "message": "Alerte de retard enregistree.",
  "lease": {
    "id": "<lease_uuid>",
    "lease_number": "LEASE-001",
    "overdue_status": "overdue",
    "days_overdue": 15,
    "overdue_amount": "50000.00",
    "missed_payment_count": 1,
    "last_overdue_alert_sent_at": "2025-01-27T14:30:00Z",
    ...
  }
}
```

**Comportement:**

- Verifie qu'il existe effectivement des paiements en retard
- Met a jour le champ `last_overdue_alert_sent_at` du bail
- Recalcule le `overdue_status` et les metriques
- TODO: Envoie des notifications (email/SMS) au tenant et au landlord

**Permissions:**

- Seul le landlord propriétaire du bien ou un property manager autorise peut envoyer une alerte
- Retourne `403 Forbidden` si l'utilisateur ne peut pas acceder au bail

### Logic de calcul des retards

Le backend execute quotidiennement une tache Celery (`update_overdue_statuses`) qui:

1. **Itere tous les bails actifs**
2. **Compare les paiements attendus vs recus:**
   - Les paiements attendus viennent des `PaymentScheduleItem` du bail
   - Les paiements recus sont dans la table `Payment` avec `status=PAID`
   - Les retards sont les items `PaymentScheduleItem` qui n'ont pas de paiement correspondant et dont la `due_date` est depassee
3. **Calcule les metriques:**
   - `missed_payment_count`: Nombre de paiements planifies non payes
   - `overdue_amount`: Somme des montants non payes
   - `days_overdue`: Nombre de jours depuis le premier paiement manque (avec periode de grace de 3 jours)
   - `overdue_status`: Determine selon le parametre `days_overdue`

**Periode de grace:**

Par defaut, il y a une **periode de grace de 3 jours** apres la `due_date`. Apres 3 jours sans paiement, le bail passe en statut `overdue`.

**Seuils de severite:**

- `on_track`: 0 jours de retard
- `overdue`: 1-29 jours de retard
- `severely_overdue`: 30 jours ou plus de retard

### Exemple de flux complet (Landlord)

```
1. Frontend affiche le dashboard avec listne des bails
2. Frontend appelle GET /api/leases/leases/overdue_summary/
3. Backend retourne les 2 bails en retard (LEASE-001: 15 jours, LEASE-003: 45 jours)
4. Landlord clique sur LEASE-003 pour voir les details
5. Frontend affiche GET /api/leases/leases/{lease_id}/overdue_status/
6. Backend retourne overdue_status="severely_overdue", days_overdue=45
7. Landlord envoie une alerte: POST /api/leases/leases/{lease_id}/alert_overdue/
8. Backend met a jour last_overdue_alert_sent_at et retourne la confirmation
9. TODO: Tenant recoit un SMS/Email d'alerte de retard
10. TODO: Landlord recoit un SMS/Email de confirmation d'alerte envoye
```

### Configuration Celery Beat (tache periodique)

Pour que les retards se mettent a jour automatiquement, assurez-vous que Celery Beat est configure pour executer la tache `leases.update_overdue_statuses` quotidiennement.

Configuration dans `settings.py`:

```python
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'update-lease-overdue-statuses': {
        'task': 'leases.update_overdue_statuses',
        'schedule': crontab(hour=0, minute=0),  # Minuit
    },
    'check-severely-overdue-leases': {
        'task': 'leases.check_severely_overdue_leases',
        'schedule': crontab(hour=6, minute=0),  # 6h du matin
    },
}
```

## Etat actuel de la documentation technique

- La spec [openapi.yaml](./openapi.yaml) existe mais n'est pas encore completement alignee avec tous les endpoints recents.
- Ce guide est la reference pratique a utiliser cote frontend en attendant l'alignement complet de la spec.
