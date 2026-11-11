import type { DocumentJuridique } from "../types/legals.types";
import { DATE_MISE_A_JOUR, INFOS_LEGALES as I, VERSION_CONFIDENTIALITE, lienMail } from "./infosLegales";

export const CONFIDENTIALITE: DocumentJuridique = {
  titre: "Politique de confidentialité",
  version: VERSION_CONFIDENTIALITE,
  dateMiseAJour: DATE_MISE_A_JOUR,
  introduction:
    "Vous nous confiez des informations sensibles : votre situation juridique, vos documents, votre voix. Cette page explique quelles données nous utilisons, pourquoi, avec qui elles sont partagées, combien de temps nous les gardons, et comment vous gardez la main dessus.",
  resume: [
    "Nous collectons uniquement ce qui sert à vous mettre en relation avec un professionnel, à faire fonctionner et à sécuriser la plateforme.",
    "Votre demande n'est transmise qu'aux professionnels sélectionnés pour y répondre. Nous ne vendons jamais vos données.",
    "Vous pouvez accéder à vos données, les corriger, vous opposer à leur usage ou demander leur suppression.",
    "Vous pouvez saisir la Commission de protection des données personnelles (CDP) du Sénégal si vous estimez que vos droits ne sont pas respectés.",
  ],
  sections: [
    {
      id: "responsable",
      titre: "Qui est responsable de vos données",
      blocs: [
        {
          type: "p",
          texte: `Le responsable du traitement est ${I.editeur}, ${I.formeJuridique}, ${I.adresse} (${I.immatriculation}). Pour toute question sur vos données : ${lienMail(I.emailDonnees)}.`,
        },
        {
          type: "p",
          texte:
            "Cette politique s'applique aux particuliers comme aux professionnels et complète nos [Conditions générales d'utilisation](/cgu). Les traitements sont conduits dans le respect de la loi sénégalaise n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel.",
        },
      ],
    },
    {
      id: "donnees",
      titre: "Les données que nous collectons",
      blocs: [
        { type: "sous-titre", texte: "Si vous êtes particulier" },
        {
          type: "liste",
          items: [
            "**Compte** : numéro de téléphone, prénom et nom, code secret (jamais conservé en clair).",
            "**Demandes** : le texte que vous écrivez, vos messages vocaux et leur transcription, les documents que vous joignez, le domaine du droit concerné, l'urgence, ainsi que les mots-clés et l'analyse automatique qui en sont tirés.",
            "**Localisation** : la zone ou le lieu que vous indiquez, ou votre position si vous choisissez de la partager, utilisés pour trouver des professionnels proches de vous.",
            "**Échanges et avis** : les notifications, les échanges avec le professionnel et les avis que vous laissez.",
          ],
        },
        { type: "sous-titre", texte: "Si vous êtes professionnel" },
        {
          type: "liste",
          items: [
            "**Identité et exercice** : prénom, nom, e-mail, téléphone, photo, métier, numéro de matricule, organisme de rattachement, spécialités, cabinet et zone d'exercice.",
            "**Dossier d'inscription** : les pièces justificatives que vous transmettez, et la décision prise (approbation ou refus motivé).",
            "**Abonnement** : moyen de paiement choisi, numéro utilisé pour un paiement mobile, montant, date et référence de chaque paiement. Nous ne conservons pas de numéro de carte bancaire.",
            "**Activité** : demandes reçues, réponses, acceptations, avis reçus, disponibilités.",
          ],
        },
        { type: "sous-titre", texte: "Pour tous" },
        {
          type: "liste",
          items: [
            "**Données techniques et de sécurité** : adresse IP, type d'appareil et de navigateur, dates de connexion, identifiants de session.",
            "**Journal d'administration** : les actions sensibles des administrateurs (validation d'un dossier, désactivation d'un compte, paiement enregistré…) sont consignées avec leur auteur, leur date et leur motif.",
          ],
        },
      ],
    },
    {
      id: "finalites",
      titre: "Pourquoi nous les utilisons",
      blocs: [
        {
          type: "liste",
          items: [
            "**Fournir le service** : créer votre compte, vous authentifier, transmettre votre demande aux professionnels adaptés, permettre l'échange et les avis. C'est l'exécution des CGU.",
            "**Vérifier les professionnels** : examiner les dossiers d'inscription pour limiter l'usurpation de titre.",
            "**Gérer les abonnements** : suivre l'essai, les échéances et les paiements des professionnels.",
            "**Vous informer** : notifications liées à vos demandes, à votre dossier ou à votre abonnement ; e-mails et SMS de service (code de connexion, réinitialisation de mot de passe).",
            "**Sécuriser la plateforme** : détecter les fraudes et les abus, protéger les comptes, garder une trace des actions d'administration. C'est notre intérêt légitime et une obligation de sécurité.",
            "**Respecter la loi** : répondre aux demandes des autorités compétentes lorsqu'elles sont fondées.",
            "**Améliorer le service** : statistiques d'usage agrégées (nombre de demandes par période ou par métier, par exemple), sans vous identifier.",
          ],
        },
      ],
    },
    {
      id: "analyse",
      titre: "Analyse automatique de vos demandes",
      blocs: [
        {
          type: "p",
          texte:
            "Pour orienter votre demande vers le bon domaine et le bon métier, nous pouvons la faire analyser par un outil automatisé : transcription d'un message vocal, repérage du sujet et de l'urgence, extraction de mots-clés. Ce résultat sert à la mise en relation et reste indicatif ; il ne constitue pas un avis juridique, et une personne de l'équipe peut le corriger.",
        },
      ],
    },
    {
      id: "destinataires",
      titre: "Qui a accès à vos données",
      blocs: [
        {
          type: "liste",
          items: [
            "**Les professionnels sélectionnés** pour répondre à votre demande reçoivent les éléments de cette demande. Vos coordonnées complètes et vos pièces sont destinées au professionnel qui prend votre demande en charge.",
            "**Les particuliers** voient, sur la fiche d'un professionnel, ses informations d'exercice, sa zone et ses avis.",
            "**L'équipe de SOS Yoon** (administrateurs) accède aux données nécessaires à l'examen des dossiers, au suivi des demandes, au support et à la sécurité. Ces accès sont tracés.",
            "**Nos prestataires techniques** : hébergement, envoi de SMS et d'e-mails, paiement mobile ou par carte, analyse automatique. Ils n'agissent que sur nos instructions et pour ces seules finalités.",
          ],
        },
        {
          type: "p",
          texte: `Hébergement : ${I.hebergeur}. Si certains prestataires sont situés hors du Sénégal, les transferts sont encadrés conformément à la loi, afin de garantir un niveau de protection suffisant.`,
        },
        { type: "p", texte: "Nous ne vendons pas vos données et ne les cédons pas à des fins publicitaires." },
      ],
    },
    {
      id: "conservation",
      titre: "Combien de temps nous les gardons",
      blocs: [
        {
          type: "liste",
          items: [
            "**Compte et demandes** : pendant la durée de votre compte, puis supprimés ou rendus anonymes dans un délai raisonnable après sa fermeture, sauf obligation de conservation.",
            "**Dossier d'inscription des professionnels** : pendant la durée de l'inscription, puis le temps nécessaire pour justifier la décision prise.",
            "**Paiements et pièces comptables** : la durée imposée par les obligations comptables et fiscales.",
            "**Journaux techniques et d'administration** : une durée limitée, nécessaire à la sécurité et à la preuve des actions réalisées.",
          ],
        },
      ],
    },
    {
      id: "securite",
      titre: "Comment nous protégeons vos données",
      blocs: [
        {
          type: "liste",
          items: [
            "connexions chiffrées (HTTPS) ; mots de passe et codes secrets jamais conservés en clair (seule une empreinte irréversible est enregistrée) ;",
            "accès limités selon le rôle (particulier, professionnel, administrateur) et sessions que l'administrateur peut révoquer ;",
            "limitation du nombre de SMS envoyés par numéro et par jour ;",
            "traçabilité des actions sensibles des administrateurs.",
          ],
        },
        {
          type: "p",
          texte:
            "Aucun système n'est infaillible. Si une violation de données vous exposait à un risque, nous vous en informerions et préviendrions l'autorité compétente dans les conditions prévues par la loi.",
        },
      ],
    },
    {
      id: "droits",
      titre: "Vos droits",
      blocs: [
        {
          type: "p",
          texte: "Vous pouvez, à tout moment et gratuitement :",
        },
        {
          type: "liste",
          items: [
            "**accéder** aux données que nous détenons sur vous ;",
            "**rectifier** une donnée inexacte ou incomplète (votre profil se modifie aussi directement dans l'application) ;",
            "**vous opposer** à un traitement pour des motifs légitimes, notamment à toute prospection ;",
            "**demander la suppression** de vos données, dans la limite de nos obligations légales de conservation.",
          ],
        },
        {
          type: "p",
          texte: `Pour exercer ces droits, écrivez à ${lienMail(I.emailDonnees)} en précisant votre numéro de téléphone ou votre e-mail d'inscription ; nous pourrons vous demander un justificatif d'identité. Nous répondons dans un délai raisonnable.`,
        },
        {
          type: "p",
          texte:
            "Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la Commission de protection des données personnelles (CDP) du Sénégal.",
        },
      ],
    },
    {
      id: "mineurs",
      titre: "Mineurs",
      blocs: [
        {
          type: "p",
          texte:
            "La plateforme s'adresse aux personnes capables de contracter. Si vous pensez qu'un mineur a créé un compte sans l'accord de son représentant légal, signalez-le-nous pour que nous puissions agir.",
        },
      ],
    },
    {
      id: "stockage-appareil",
      titre: "Données conservées sur votre appareil",
      blocs: [
        {
          type: "p",
          texte:
            "Pour vous garder connecté et faire fonctionner l'application, nous enregistrons dans votre navigateur des jetons de session et, le cas échéant, vos préférences. Ils sont nécessaires au service ; vous pouvez les supprimer en vous déconnectant ou en effaçant les données du site.",
        },
      ],
    },
    {
      id: "modifications",
      titre: "Évolution de cette politique",
      blocs: [
        {
          type: "p",
          texte:
            "Nous pouvons mettre à jour cette politique. La version et la date figurent en haut de page ; en cas de changement important, nous vous en informons avant son entrée en vigueur.",
        },
      ],
    },
  ],
};