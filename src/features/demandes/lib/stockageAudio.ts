const BASE = "sos-yoon";
const TABLE = "audio";
const CLE = "demande-en-attente";

function ouvrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const requete = indexedDB.open(BASE, 1);
    requete.onupgradeneeded = () => {
      requete.result.createObjectStore(TABLE);
    };
    requete.onsuccess = () => resolve(requete.result);
    requete.onerror = () => reject(requete.error);
  });
}

async function executer<T>(
  mode: IDBTransactionMode,
  action: (table: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await ouvrir();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(TABLE, mode);
    const requete = action(tx.objectStore(TABLE));
    tx.oncomplete = () => {
      db.close();
      resolve(requete.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/** Renvoie false si le navigateur refuse de stocker l'enregistrement */
export async function sauverAudio(blob: Blob): Promise<boolean> {
  try {
    await executer("readwrite", (t) => t.put(blob, CLE));
    return true;
  } catch {
    return false;
  }
}

export async function lireAudio(): Promise<Blob | null> {
  try {
    const valeur: unknown = await executer("readonly", (t) => t.get(CLE));
    return valeur instanceof Blob ? valeur : null;
  } catch {
    return null;
  }
}

export async function supprimerAudio(): Promise<void> {
  try {
    await executer("readwrite", (t) => t.delete(CLE));
  } catch {
    // Rien à supprimer ou stockage indisponible : sans conséquence
  }
}