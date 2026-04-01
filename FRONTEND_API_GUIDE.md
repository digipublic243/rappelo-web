# Guide Frontend API

Ce document est une vue d'integration pour le frontend. Il ne remplace pas la spec OpenAPI, mais il indique quels endpoints utiliser, dans quel ordre, et quels points d'attention respecter.

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

Usage frontend:

- recuperer le role apres login
- router vers dashboard bailleur ou locataire
- afficher le profil courant

## Flows frontend par domaine

### A. Landlord dashboard

#### Proprietes

- `GET /api/properties/properties/`
- `POST /api/properties/properties/`
- `GET /api/properties/properties/{id}/`
- `PATCH /api/properties/properties/{id}/`
- `POST /api/properties/properties/{id}/activate/`
- `POST /api/properties/properties/{id}/deactivate/`
- `GET /api/properties/properties/{id}/financials/`
- `GET /api/properties/properties/{id}/statistics/`

#### Managers de propriete

- `POST /api/properties/properties/{id}/assign_manager/`
- `GET /api/properties/properties/{id}/managers/`
- `GET /api/properties/managers/`
- `PATCH /api/properties/managers/{id}/`
- `POST /api/properties/managers/{id}/update_permissions/`
- `POST /api/properties/managers/{id}/remove/`

#### Unites

- `GET /api/properties/units/`
- `POST /api/properties/units/`
- `GET /api/properties/units/{id}/`
- `PATCH /api/properties/units/{id}/`
- `POST /api/properties/units/{id}/activate/`
- `POST /api/properties/units/{id}/deactivate/`
- `POST /api/properties/units/{id}/update_status/`
- `GET /api/properties/units/available/?property_id=<property_uuid>`

Champs frontend importants sur `Unit`:

- `rent_period`: `daily | weekly | monthly | other`
- `monthly_rent`: montant du loyer pour la periode choisie
- `security_deposit`
- `booking_deposit`
- `allowed_payment_methods`: liste ex. `['cash', 'easypay']`

### B. Tenant management

#### Comptes utilisateurs

- `POST /api/accounts/users/` pour creer un tenant si le bailleur gere la creation de compte via backoffice

#### Profils locataires

- `GET /api/tenants/profiles/`
- `POST /api/tenants/profiles/`
- `GET /api/tenants/profiles/{id}/`
- `PATCH /api/tenants/profiles/{id}/`
- `GET /api/tenants/profiles/{id}/statistics/`

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

### C. Booking flow

#### Creer une reservation (tenant)

- `POST /api/leases/bookings/`

Payload type:

```json
{
  "unit": "<unit_uuid>",
  "check_in": "2026-04-10",
  "check_out": "2026-05-10",
  "booking_deposit": "50.00",
  "notes": "Je souhaite reserver cette unite"
}
```

Le backend affecte automatiquement `tenant = request.user`.

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
  "scope": "global",
  "unit": "<unit_uuid>",
  "valid_from": "2026-04-01",
  "valid_until": "2026-04-30",
  "is_active": true
}
```

### F. Payments

- `GET /api/payments/payments/`
- `POST /api/payments/payments/`
- `GET /api/payments/payments/{id}/`
- `PATCH /api/payments/payments/{id}/`
- `POST /api/payments/payments/{id}/confirm/`
- `GET /api/payments/payments/overdue/`
- `GET /api/payments/payments/summary/`
- `POST /api/payments/payments/{id}/generate_link/`

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
{ "detail": "Invalid OTP code." }
```

ou

```json
{ "error": "Property not found" }
```

Le frontend doit donc tolerer les deux formes: `detail` et `error`.

## Points d'attention frontend

1. Utiliser `/api/auth/otp/*` comme routes OTP canoniques. Il existe aussi des routes dupliquees sous `/api/accounts/otp/*`, mais elles ne doivent pas etre la reference principale.
2. Les ressources metier utilisent des UUID, pas des entiers.
3. `monthly_rent` represente le montant associe a `rent_period`, il ne faut pas supposer que c'est toujours mensuel.
4. `Booking.confirm` ne rend pas le `Lease` directement separement, mais la reservation mise a jour avec son champ `lease` rempli.
5. Le webhook `POST /api/payments/payments/callback/{token}/` n'est pas destine a l'application frontend.
6. L'integration EasyPay n'est pas encore cablee: le contrat d'API est prepare, mais `gateway_url` restera vide tant que le provider n'est pas branche.

## Sequence recommandee pour le frontend

### Landlord

1. Login
2. `GET /api/accounts/users/me/`
3. `GET /api/properties/properties/`
4. `GET /api/payments/payments/summary/`
5. `GET /api/leases/bookings/` pour les reservations en attente

### Tenant

1. OTP request
2. OTP verify
3. `GET /api/accounts/users/me/`
4. `GET /api/leases/bookings/`
5. `GET /api/leases/leases/`
6. `GET /api/payments/payments/`

## Etat actuel de la documentation technique

- La spec [openapi.yaml](./openapi.yaml) existe mais n'est pas encore completement alignee avec tous les endpoints recents.
- Ce guide est la reference pratique a utiliser cote frontend en attendant l'alignement complet de la spec.