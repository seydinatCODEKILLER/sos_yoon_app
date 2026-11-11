import type { DocumentJuridique } from "../types/legals.types";
import { DATE_MISE_A_JOUR, INFOS_LEGALES as I, VERSION_CGU, lienMail } from "./infosLegales";

export const CGU: DocumentJuridique = {
  titre: "Conditions générales d'utilisation",
  version: VERSION_CGU,
  dateMiseAJour: DATE_MISE_A_JOUR,
  introduction:
    "Ces conditions expliquent ce que SOS Yoon fait, ce qu'elle ne fait pas, et ce que chacun peut attendre de l'autre. Prenez le temps de les lire : en créant un compte ou en utilisant la plateforme, vous les acceptez.",
  resume: [
    "SOS Yoon met en relation des particuliers et des professionnels du droit au Sénégal (avocats, huissiers, notaires, juristes-conseils).",
    "SOS Yoon n'est ni un cabinet ni un service d'urgence : elle ne donne pas de conseil juridique et ne remplace ni la police, ni la gendarmerie, ni les secours.",
    "Les professionnels sont indépendants : chacun répond de ses conseils et de ses honoraires, convenus directement avec vous.",
    "Les professionnels paient un abonnement mensuel après un mois d'essai gratuit.",
    "Vos données sont traitées selon notre [Politique de confidentialité](/confidentialite).",
  ],
  sections: [
    {
      id: "objet",
      titre: "Objet et acceptation",
      blocs: [
        {
          type: "p",
          texte: `Les présentes conditions générales d'utilisation (« CGU ») régissent l'accès et l'utilisation de la plateforme SOS Yoon (le site et l'application), éditée par ${I.editeur}, ${I.formeJuridique}, dont le siège est situé ${I.adresse} (${I.immatriculation}).`,
        },
        {
          type: "p",
          texte:
            "Vous acceptez les CGU en cochant la case prévue lors de l'inscription, ou en utilisant la plateforme. Si vous ne les acceptez pas, vous ne pouvez pas créer de compte.",
        },
      ],
    },
    {
      id: "definitions",
      titre: "Définitions",
      blocs: [
        {
          type: "liste",
          items: [
            "**Plateforme** : le site et l'application SOS Yoon.",
            "**Particulier** : toute personne qui utilise la plateforme pour trouver un professionnel du droit.",
            "**Professionnel** : avocat, huissier de justice, notaire ou juriste-conseil inscrit sur la plateforme.",
            "**Demande** : la description d'une situation juridique, en texte ou en message vocal, que le particulier soumet pour être mis en relation.",
            "**Abonnement** : le service payant mensuel que souscrit le professionnel pour recevoir des demandes.",
          ],
        },
      ],
    },
    {
      id: "service",
      titre: "Ce que fait SOS Yoon, et ce qu'elle ne fait pas",
      blocs: [
        {
          type: "p",
          texte:
            "SOS Yoon est un service de **mise en relation**. Quand un particulier soumet une demande, la plateforme la transmet à des professionnels susceptibles d'y répondre, en tenant compte notamment du domaine du droit, de leur métier et de leur zone d'exercice. Le premier professionnel qui accepte prend la demande en charge.",
        },
        {
          type: "p",
          texte:
            "SOS Yoon n'est pas un cabinet de conseil, n'exerce aucune profession juridique réglementée et **ne donne pas de conseil juridique**. Les informations affichées sur la plateforme, y compris les analyses automatiques d'une demande, sont indicatives : elles ne remplacent pas l'avis d'un professionnel.",
        },
        {
          type: "note",
          texte:
            "Malgré son nom, SOS Yoon n'est pas un service d'urgence. En cas de danger immédiat pour vous ou pour autrui, contactez sans attendre la police, la gendarmerie ou les services de secours.",
        },
      ],
    },
    {
      id: "comptes",
      titre: "Création et sécurité du compte",
      blocs: [
        { type: "sous-titre", texte: "Particuliers" },
        {
          type: "p",
          texte:
            "L'inscription se fait avec votre numéro de téléphone mobile, confirmé par un code reçu par SMS, puis un code secret que vous choisissez. Vous déclarez avoir la capacité juridique de contracter, et que les informations que vous fournissez sont exactes.",
        },
        { type: "sous-titre", texte: "Professionnels" },
        {
          type: "p",
          texte:
            "L'inscription se fait avec une adresse e-mail et un mot de passe, puis un dossier comprenant vos informations professionnelles et des pièces justificatives. L'équipe de SOS Yoon examine ce dossier et peut l'approuver ou le refuser en indiquant un motif. Tant que le dossier n'est pas approuvé, votre compte ne peut pas recevoir de demandes.",
        },
        { type: "sous-titre", texte: "Pour tous" },
        {
          type: "liste",
          items: [
            "Vos identifiants sont personnels : ne les partagez pas. Vous êtes responsable de ce qui est fait avec votre compte.",
            "Prévenez-nous sans délai si vous pensez que quelqu'un d'autre y a accédé.",
            "Une seule personne, un seul compte : la création de faux comptes ou de comptes multiples est interdite.",
          ],
        },
      ],
    },
    {
      id: "particuliers",
      titre: "Utilisation par les particuliers",
      blocs: [
        {
          type: "p",
          texte:
            "Décrivez votre situation avec sincérité et le plus précisément possible : c'est ce qui permet de vous orienter vers le bon professionnel. Vous pouvez joindre des documents ou un message vocal. Ne transmettez que ce qui est utile à votre demande.",
        },
        {
          type: "p",
          texte:
            "Une fois votre demande prise en charge, vous échangez directement avec le professionnel. Les honoraires éventuels, leur montant et leurs modalités de paiement relèvent **uniquement** de votre accord avec lui ; SOS Yoon n'y est pas partie.",
        },
        {
          type: "p",
          texte:
            "Après l'échange, vous pouvez laisser un avis sur le professionnel. Il doit refléter votre expérience réelle, rester respectueux et ne contenir aucune information personnelle sur des tiers. L'utilisation de la plateforme est gratuite pour les particuliers.",
        },
      ],
    },
    {
      id: "professionnels",
      titre: "Obligations des professionnels",
      blocs: [
        {
          type: "p",
          texte: "En vous inscrivant comme professionnel, vous vous engagez à :",
        },
        {
          type: "liste",
          items: [
            "exercer réellement la profession indiquée et rester en règle avec votre ordre, chambre ou organisme de rattachement ; signaler tout changement de situation, notamment une suspension ou une radiation ;",
            "fournir des justificatifs authentiques et des informations exactes, et les tenir à jour ;",
            "répondre aux demandes qui vous sont adressées dans les délais indiqués dans l'application, ou les refuser ;",
            "respecter vos règles déontologiques et le secret professionnel dans vos échanges avec les particuliers ;",
            "convenir de vos honoraires de façon transparente avec le particulier, avant toute prestation ;",
            "ne pas utiliser les coordonnées reçues via la plateforme à d'autres fins que de répondre à la demande concernée.",
          ],
        },
        {
          type: "p",
          texte:
            "Vous restez seul responsable des conseils et des prestations que vous fournissez. SOS Yoon ne contrôle pas le contenu de vos échanges avec les particuliers.",
        },
      ],
    },
    {
      id: "abonnement",
      titre: "Abonnement et paiement des professionnels",
      blocs: [
        {
          type: "liste",
          items: [
            "Après l'approbation de votre dossier, vous bénéficiez d'une période d'essai gratuite dont la durée est indiquée dans votre espace.",
            "À l'issue de l'essai, l'accès aux demandes est subordonné au paiement d'un abonnement mensuel. Son montant en vigueur, qui peut varier selon le métier, est affiché dans votre espace et vous est communiqué avant tout paiement.",
            "Le paiement s'effectue par les moyens proposés dans l'application (par exemple Orange Money, Wave ou carte bancaire). Chaque paiement prolonge votre abonnement d'un mois à compter de l'échéance en cours ou, si elle est dépassée, de la date du paiement.",
            "Sans paiement, votre compte est suspendu : vous n'avez plus accès à la plateforme, à l'exception des pages qui permettent de régler votre abonnement. Il est réactivé à l'enregistrement du paiement.",
            "Les mensualités entamées ne sont pas remboursées, sauf disposition légale contraire.",
          ],
        },
        {
          type: "p",
          texte:
            "SOS Yoon peut modifier le montant de l'abonnement. Toute modification s'applique aux mensualités suivantes et vous est annoncée au préalable.",
        },
      ],
    },
    {
      id: "contenus",
      titre: "Contenus et propriété intellectuelle",
      blocs: [
        {
          type: "p",
          texte:
            "La plateforme, son nom, ses logos, ses textes et son code sont protégés. Aucun droit ne vous est cédé, hormis un droit d'usage personnel et non exclusif, le temps de votre inscription.",
        },
        {
          type: "p",
          texte:
            "Vous restez propriétaire des contenus que vous publiez (demandes, documents, messages vocaux, avis, photo de profil). Vous accordez à SOS Yoon l'autorisation de les héberger, de les traiter et de les transmettre aux personnes concernées, dans la seule mesure nécessaire au fonctionnement du service.",
        },
      ],
    },
    {
      id: "interdits",
      titre: "Comportements interdits",
      blocs: [
        {
          type: "liste",
          items: [
            "usurper l'identité d'une personne ou se faire passer pour un professionnel sans l'être ;",
            "publier un contenu illicite, diffamatoire, injurieux, discriminatoire, ou portant atteinte à la vie privée d'autrui ;",
            "soumettre de fausses demandes, ou des demandes sans lien avec un besoin juridique réel ;",
            "harceler un professionnel ou un particulier, ou le démarcher à des fins commerciales ;",
            "tenter d'accéder à des données qui ne vous concernent pas, perturber le service, ou l'utiliser avec des outils automatisés non autorisés.",
          ],
        },
      ],
    },
    {
      id: "suspension",
      titre: "Suspension et fermeture d'un compte",
      blocs: [
        {
          type: "p",
          texte:
            "SOS Yoon peut désactiver un compte, temporairement ou définitivement, en cas de manquement aux CGU, de fraude, de pièces justificatives inexactes, de signalement sérieux ou de défaut de paiement d'un abonnement. Sauf urgence, un motif est indiqué. Les décisions des administrateurs sont consignées dans un journal interne.",
        },
        {
          type: "p",
          texte: `Vous pouvez demander la fermeture de votre compte à tout moment en écrivant à ${lienMail(I.emailContact)}. Le traitement de vos données à cette occasion est décrit dans la [Politique de confidentialité](/confidentialite).`,
        },
      ],
    },
    {
      id: "responsabilite",
      titre: "Responsabilité",
      blocs: [
        {
          type: "p",
          texte:
            "SOS Yoon met en œuvre les moyens raisonnables pour que la plateforme soit disponible et sécurisée, sans pouvoir garantir un accès ininterrompu : des opérations de maintenance ou des incidents techniques peuvent survenir.",
        },
        {
          type: "p",
          texte:
            "SOS Yoon n'est pas responsable de la qualité, de l'exactitude ou du résultat des conseils et prestations fournis par les professionnels, ni des accords conclus entre un professionnel et un particulier. Elle ne garantit pas qu'un professionnel acceptera une demande, ni dans quel délai. Sa responsabilité ne saurait être engagée pour des faits dus à un cas de force majeure, au fait d'un tiers ou à votre propre faute, dans les limites permises par la loi.",
        },
      ],
    },
    {
      id: "donnees",
      titre: "Données personnelles",
      blocs: [
        {
          type: "p",
          texte:
            "Le traitement de vos données personnelles, vos droits et la manière de les exercer sont décrits dans notre [Politique de confidentialité](/confidentialite), qui fait partie des présentes CGU.",
        },
      ],
    },
    {
      id: "modifications",
      titre: "Modification des CGU",
      blocs: [
        {
          type: "p",
          texte:
            "Les CGU peuvent évoluer, par exemple pour suivre une nouvelle fonctionnalité ou un changement de la loi. Chaque version porte un numéro et une date. En cas de changement important, nous vous en informons avant son entrée en vigueur ; continuer à utiliser la plateforme après cette date vaut acceptation de la nouvelle version.",
        },
      ],
    },
    {
      id: "droit",
      titre: "Droit applicable et litiges",
      blocs: [
        {
          type: "p",
          texte: `Les CGU sont soumises au droit sénégalais. En cas de difficulté, contactez-nous d'abord : nous chercherons une solution amiable. À défaut, le litige relève des ${I.tribunal}, sous réserve des règles impératives de compétence qui s'appliqueraient à votre situation.`,
        },
      ],
    },
    {
      id: "contact",
      titre: "Nous contacter",
      blocs: [
        {
          type: "p",
          texte: `Pour toute question sur ces conditions : ${lienMail(I.emailContact)}.`,
        },
      ],
    },
  ],
};