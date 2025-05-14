import axios from 'axios';
import { Domain, Workspace, Season, Farm, LotField } from "@/lib/interfaces"

const apiUrl = process.env.NEXT_PUBLIC_FMS_API_URL || '';
const apiKey = process.env.NEXT_PUBLIC_FMS_API_KEY || '';

export const listDomainsByUserEmail = async (user: string, lang?: string): Promise<Domain[]> => {
    const query = `
      query ($email: String!) {
        domains_areas_by_user(email: $email) {
          deleted
          id
          name
          languageId
        }
      }
    `;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ query, variables: { email: user } }),
        });

        const result = await response.json();

        //console.log("Result fetching domains: ", result)

        if (!response.ok || result.errors) {
            throw new Error(result.errors ? JSON.stringify(result.errors) : `HTTP ${response.status}`);
        }

        return result.data?.domains_areas_by_user ?? [];
    } catch (error) {
        console.error('Error fetching domains:', error);
        return [];
    }

};

export const listWorkspaces = async (email: string, parentId?: string): Promise<Workspace[]> => {
    const query = `
      query ($email: String!, $domainId: Int, $lang: String, $parentId: Int) {
        list_workspaces(email: $email, domainId: $domainId, lang: $lang, parentId: $parentId) {
            deleted
            hasLogo
            id
            languageId
            name
            note
            parentId
            permission
        }
    }`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ query, variables: { email: email, parentId: parentId } }),
        });

        const result = await response.json();

        if (!response.ok || result.errors) {
            throw new Error(result.errors ? JSON.stringify(result.errors) : `HTTP ${response.status}`);
        }

        return result.data?.list_workspaces ?? [];
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        return [];
    }
}

export const listSeasons = async (workspaceId: string): Promise<Season[]> => {
    const query = `
      query ($workspaceId: Int!){
        list_seasons(workspaceId: $workspaceId) {
            deleted
            id
            name
            startDate
            endDate
            workspaceId
        }
        }`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ query, variables: { workspaceId: workspaceId } }),
        });

        const result = await response.json();
        // console.log("result: ", result)

        if (!response.ok || result.errors) {
            throw new Error(result.errors ? JSON.stringify(result.errors) : `HTTP ${response.status}`);
        }

        return result.data?.list_seasons ?? [];
    } catch (error) {
        console.error('Error fetching seasons:', error);
        return [];
    }
}

export const listFarms = async (workspaceId: string, seasonId: string): Promise<Farm[]> => {
    const query = `
      query ($workspaceId: Int!, $seasonId: Int, $userId: String, $lang: String, $includeGeoJson: Boolean) {
        list_farms(workspaceId: $workspaceId, seasonId: $seasonId, userId: $userId, lang: $lang, includeGeoJson: $includeGeoJson) {
            id
            name
            permission
            seasonId
            workspaceId
            deleted
        }
        }`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ query, variables: { workspaceId: workspaceId, seasonId: seasonId } }),
        });

        const result = await response.json();

        if (!response.ok || result.errors) {
            throw new Error(result.errors ? JSON.stringify(result.errors) : `HTTP ${response.status}`);
        }

        return result.data?.list_farms ?? [];
    } catch (error) {
        console.error('Error fetching farms:', error);
        return [];
    }
}

export const listFields = async (workspaceId: string, seasonId: string, farmId: string): Promise<LotField[]> => {
    const query = `
      query ($farmId: Int!, $seasonId: Int!, $workspaceId: Int!, $lang: String) {
        list_fields(farmId: $farmId, seasonId: $seasonId, workspaceId: $workspaceId, lang: $lang) {
            cropDate
            cropId
            cropName
            farmId
            hectares
            hybridId
            hybridName
            id
            layerId
            name
            seasonId
            workspaceId
        }
    }`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ query, variables: { workspaceId: workspaceId, seasonId: seasonId, farmId: farmId } }),
        });

        const result = await response.json();

        if (!response.ok || result.errors) {
            throw new Error(result.errors ? JSON.stringify(result.errors) : `HTTP ${response.status}`);
        }

        return result.data?.list_fields ?? [];
    } catch (error) {
        console.error('Error fetching fields:', error);
        return [];
    }
}

// TO DO: implement // tener en cuenta que lastLogin viene null a veces y lo convertí en "" para avanzar
export const listUsersByDomain = async (domainId: number) => {
    return [
        {
            "created": "2022-09-13",
            "email": "garciahnoss2@gmail.com",
            "firstName": "Sebastián",
            "isoLanguages": "es",
            "lastLogin": "2022-11-02",
            "lastName": "García"
        },
        {
            "created": "2020-09-02",
            "email": "ventronileandro@gmail.com",
            "firstName": "Leandro",
            "isoLanguages": "es",
            "lastLogin": "2022-05-02",
            "lastName": "Ventroni"
        },
        {
            "created": "2022-07-25",
            "email": "sofiaconsole@gmail.com",
            "firstName": "Sofia",
            "isoLanguages": "es",
            "lastLogin": "2022-08-10",
            "lastName": "Console"
        },
        {
            "created": "2021-09-24",
            "email": "luisacapelle@gmail.com",
            "firstName": "Luisa",
            "isoLanguages": "es",
            "lastLogin": "2025-04-03",
            "lastName": "Capelle"
        },
        {
            "created": "2023-12-26",
            "email": "dandreajavier88@gmail.com",
            "firstName": "Javier",
            "isoLanguages": "es",
            "lastLogin": "2024-03-19",
            "lastName": "Dandrea"
        },
        {
            "created": "2022-03-21",
            "email": "2494556108ct@gmail.com",
            "firstName": "Tomas",
            "isoLanguages": "es",
            "lastLogin": "2022-05-04",
            "lastName": "Gonzalez Otero"
        },
        {
            "created": "2022-04-27",
            "email": "sofiaacacio9@gmail.com",
            "firstName": "Acacio",
            "isoLanguages": "es",
            "lastLogin": "2022-06-27",
            "lastName": "Sofia"
        },
        {
            "created": "2024-12-09",
            "email": "pasorocha@gmail.com",
            "firstName": "Paso Rocha",
            "isoLanguages": "es",
            "lastLogin": "2025-03-26",
            "lastName": ""
        },
        {
            "created": "2021-01-08",
            "email": "marcosninchauspe@gmail.com",
            "firstName": "Marcos",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Inchauspe"
        },
        {
            "created": "2020-08-20",
            "email": "nicoteruggi@gmail.com",
            "firstName": "Nicolas",
            "isoLanguages": "es",
            "lastLogin": "2025-04-16",
            "lastName": "Teruggi"
        },
        {
            "created": "2021-01-28",
            "email": "valentincalderonsn@gmail.com",
            "firstName": "valentin nahuel",
            "isoLanguages": "es",
            "lastLogin": "2022-03-02",
            "lastName": "calderon"
        },
        {
            "created": "2024-09-09",
            "email": "2494271245ct@gmail.com",
            "firstName": "Francisco",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Barata"
        },
        {
            "created": "2022-09-09",
            "email": "2281409332ct@gmail.com",
            "firstName": "2281409332ct",
            "isoLanguages": "es",
            "lastLogin": "2022-09-09",
            "lastName": "Ceres"
        },
        {
            "created": "2023-01-23",
            "email": "leoteruggi07@gmail.com",
            "firstName": "Leandro",
            "isoLanguages": "es",
            "lastLogin": "2024-02-07",
            "lastName": "Teruggi"
        },
        {
            "created": "2020-12-10",
            "email": "catalina2604@gmail.com",
            "firstName": "Catalina",
            "isoLanguages": "es",
            "lastLogin": "2023-12-20",
            "lastName": "Fernandez"
        },
        {
            "created": "2022-03-16",
            "email": "2494581580ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2022-05-16",
            "lastName": "Tolvas"
        },
        {
            "created": "2022-04-29",
            "email": "2494487460ct@gmail.com",
            "firstName": "Cerws",
            "isoLanguages": "es",
            "lastLogin": "2022-07-27",
            "lastName": "Tolvas"
        },
        {
            "created": "2022-09-19",
            "email": "valentinbordino1@gmail.com",
            "firstName": "Valentin",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Bordino"
        },
        {
            "created": "2020-09-09",
            "email": "marcelotorresct@gmail.com",
            "firstName": "Marcelo",
            "isoLanguages": "es",
            "lastLogin": "2022-04-29",
            "lastName": "Torres"
        },
        {
            "created": "2021-07-06",
            "email": "sebastiansferreyra16@gmail.com",
            "firstName": "sebastian",
            "isoLanguages": "es",
            "lastLogin": "2021-11-01",
            "lastName": "ferreyra"
        },
        {
            "created": "2023-11-06",
            "email": "fmolina.agro@gmail.com",
            "firstName": "Federico",
            "isoLanguages": "es",
            "lastLogin": "2024-02-20",
            "lastName": "Molina"
        },
        {
            "created": "2024-05-07",
            "email": "juanpablofer5@gmail.com",
            "firstName": "juan pablo",
            "isoLanguages": "es,en",
            "lastLogin": "2025-01-05",
            "lastName": "fernandez"
        },
        {
            "created": "2022-03-25",
            "email": "2494319244ct@gmail.com",
            "firstName": "Leonardo",
            "isoLanguages": "es",
            "lastLogin": "2022-11-11",
            "lastName": "Petruchi"
        },
        {
            "created": "2022-01-17",
            "email": "ecoronel91@gmail.com",
            "firstName": "Evelyn",
            "isoLanguages": "es",
            "lastLogin": "2022-08-25",
            "lastName": "Coronel"
        },
        {
            "created": "2023-06-14",
            "email": "leguiacarlosalberto@gmail.com",
            "firstName": "Carlos Alberto",
            "isoLanguages": "es",
            "lastLogin": "2023-06-15",
            "lastName": "Leguia"
        },
        {
            "created": "2022-06-24",
            "email": "gonzalopizarro89@gmail.com",
            "firstName": "Gonzalo",
            "isoLanguages": "es",
            "lastLogin": "2022-09-12",
            "lastName": "Pizarro"
        },
        {
            "created": "2023-04-13",
            "email": "2926407631ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2023-06-24",
            "lastName": "Tolvas"
        },
        {
            "created": "2022-04-26",
            "email": "2326408475ct@gmail.com",
            "firstName": "Maira",
            "isoLanguages": "es",
            "lastLogin": "2022-06-08",
            "lastName": "Monzón"
        },
        {
            "created": "2023-05-12",
            "email": "2314470979ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Tolvas Bolívar"
        },
        {
            "created": "2021-11-08",
            "email": "td@geoagro.com",
            "firstName": "Antonio",
            "isoLanguages": "es",
            "lastLogin": "2024-09-26",
            "lastName": "Di Pollina - geoagro"
        },
        {
            "created": "2021-07-14",
            "email": "bernardiego@gmail.com",
            "firstName": "Diego",
            "isoLanguages": "es",
            "lastLogin": "2024-09-01",
            "lastName": "Bernardi"
        },
        {
            "created": "2022-03-17",
            "email": "2494502476ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2022-06-21",
            "lastName": "Tolvas"
        },
        {
            "created": "2022-03-17",
            "email": "2494599608ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2022-05-04",
            "lastName": "Tolvas"
        },
        {
            "created": "2022-03-25",
            "email": "2266530246ct@gmail.com",
            "firstName": "agronlmia",
            "isoLanguages": "es",
            "lastLogin": "2022-04-18",
            "lastName": "balcarce"
        },
        {
            "created": "2022-08-12",
            "email": "ghrodriguez1969@gmail.com",
            "firstName": "Guillermo",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Rodriguez"
        },
        {
            "created": "2021-06-02",
            "email": "gabrielsandinsaez@gmail.com",
            "firstName": "Gabriel",
            "isoLanguages": "es",
            "lastLogin": "2025-03-04",
            "lastName": "Sandin"
        },
        {
            "created": "2022-05-16",
            "email": "joaquinortad@gmail.com",
            "firstName": "Joaquín",
            "isoLanguages": "es",
            "lastLogin": "2022-06-08",
            "lastName": "Orta"
        },
        {
            "created": "2022-07-13",
            "email": "2494277759ct@gmail.com",
            "firstName": "Lucia Ceres",
            "isoLanguages": "es",
            "lastLogin": "2022-08-06",
            "lastName": "Tolvas"
        },
        {
            "created": "2024-09-27",
            "email": "irios@geoagro.com",
            "firstName": "Isrrael",
            "isoLanguages": "es",
            "lastLogin": "2025-04-14",
            "lastName": "Rios Morales"
        },
        {
            "created": "2022-04-20",
            "email": "martalopezbenegas@gmail.com",
            "firstName": "Marta",
            "isoLanguages": "es",
            "lastLogin": "2022-05-06",
            "lastName": "Lopez Benegas"
        },
        {
            "created": "2021-06-29",
            "email": "luzuriagaangelina@gmail.com",
            "firstName": "Angelina",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Luzuriaga"
        },
        {
            "created": "2022-03-16",
            "email": "2281567941ct@gmail.com",
            "firstName": "2281567941ct",
            "isoLanguages": "es",
            "lastLogin": "2022-04-20",
            "lastName": "Ceres"
        },
        {
            "created": "2022-09-14",
            "email": "pablomarelli1974@gmail.com",
            "firstName": "Pablo",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Marelli"
        },
        {
            "created": "2024-09-03",
            "email": "nicolasbolanoc@gmail.com",
            "firstName": "Nicolas",
            "isoLanguages": "es",
            "lastLogin": "2024-09-12",
            "lastName": "Bolaño"
        },
        {
            "created": "2022-05-10",
            "email": "2983546971ct@gmail.com",
            "firstName": "2983546971ct",
            "isoLanguages": "es",
            "lastLogin": "2022-10-19",
            "lastName": "Ceres"
        },
        {
            "created": "2024-02-26",
            "email": "nicolasgarciact@gmail.com",
            "firstName": "Nicolas",
            "isoLanguages": "es",
            "lastLogin": "2025-04-04",
            "lastName": "Garcia"
        },
        {
            "created": "2022-07-06",
            "email": "victoriasotullo@gmail.com",
            "firstName": "Victoria",
            "isoLanguages": "es",
            "lastLogin": "2022-07-21",
            "lastName": "Sotullo"
        },
        {
            "created": "2020-08-19",
            "email": "fpicardi@geoagro.com",
            "firstName": "Federico",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Picardi"
        },
        {
            "created": "2023-06-28",
            "email": "borniegoc@gmail.com",
            "firstName": "Carlos",
            "isoLanguages": "es",
            "lastLogin": "2025-04-04",
            "lastName": "Borniego"
        },
        {
            "created": "2022-03-25",
            "email": "2241552588ct@gmail.com",
            "firstName": "CeresTolvas",
            "isoLanguages": "es",
            "lastLogin": "2025-01-10",
            "lastName": "Chascomus"
        },
        {
            "created": "2021-10-15",
            "email": "leonelpaladini@gmail.com",
            "firstName": "Leonel",
            "isoLanguages": "es",
            "lastLogin": "2022-03-18",
            "lastName": "Paladini"
        },
        {
            "created": "2023-02-08",
            "email": "2262235741ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2023-07-31",
            "lastName": "Tolvas"
        },
        {
            "created": "2022-09-09",
            "email": "afpaz1982@gmail.com",
            "firstName": "Armando F.",
            "isoLanguages": "es",
            "lastLogin": "2022-11-05",
            "lastName": "Paz"
        },
        {
            "created": "2022-04-12",
            "email": "1126338580ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2024-10-18",
            "lastName": "Tolvas"
        },
        {
            "created": "2022-09-15",
            "email": "ghrodriguez@e-cazenave.com.ar",
            "firstName": "willy",
            "isoLanguages": "es",
            "lastLogin": "2022-09-15",
            "lastName": "willy"
        },
        {
            "created": "2023-07-03",
            "email": "diegogermanberinguer.04@gmail.com",
            "firstName": "Diego German",
            "isoLanguages": "es",
            "lastLogin": "2023-07-17",
            "lastName": "Beringuer"
        },
        {
            "created": "2022-09-16",
            "email": "rfanquela@gmail.com",
            "firstName": "Rafael",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Anquela"
        },
        {
            "created": "2024-11-27",
            "email": "2494592295ct@gmail.com",
            "firstName": "Camila",
            "isoLanguages": "es",
            "lastLogin": "2025-02-17",
            "lastName": "Orlando"
        },
        {
            "created": "2022-03-16",
            "email": "2281596978ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2022-10-05",
            "lastName": "Ceres"
        },
        {
            "created": "2020-08-25",
            "email": "nchicatun@gmail.com",
            "firstName": "Nicolas",
            "isoLanguages": "es",
            "lastLogin": "2025-02-19",
            "lastName": "Chicatun"
        },
        {
            "created": "2022-10-27",
            "email": "gonihnossrl1@gmail.com",
            "firstName": "Pablo",
            "isoLanguages": "es",
            "lastLogin": "2022-11-30",
            "lastName": "Goñi"
        },
        {
            "created": "2022-04-13",
            "email": "2331401296ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2024-04-01",
            "lastName": "Tolvas"
        },
        {
            "created": "2020-08-19",
            "email": "mat@geoagro.com",
            "firstName": "Mario A.",
            "isoLanguages": "es",
            "lastLogin": "2025-04-16",
            "lastName": "Teruggi"
        },
        {
            "created": "2020-09-20",
            "email": "fhpicardi@gmail.com",
            "firstName": "Federico",
            "isoLanguages": "es",
            "lastLogin": "2024-07-26",
            "lastName": ""
        },
        {
            "created": "2022-05-04",
            "email": "ehdigiano@gmail.com",
            "firstName": "Ezequiel",
            "isoLanguages": "es",
            "lastLogin": "2022-09-14",
            "lastName": "Di Giano"
        },
        {
            "created": "2020-08-13",
            "email": "ma@geoagro.com",
            "firstName": "Mariano",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Acuña"
        },
        {
            "created": "2023-05-23",
            "email": "mbruzzo911@gmail.com",
            "firstName": "mateo",
            "isoLanguages": "es",
            "lastLogin": "2025-03-31",
            "lastName": "bruzzo"
        },
        {
            "created": "2024-06-02",
            "email": "sergiosalim71@gmail.com",
            "firstName": "Sergio",
            "isoLanguages": "es",
            "lastLogin": "2025-03-18",
            "lastName": "Salim"
        },
        {
            "created": "2021-11-11",
            "email": "petruchileonardo@gmail.com",
            "firstName": "Leonardo",
            "isoLanguages": "es",
            "lastLogin": "2022-11-11",
            "lastName": "Petruchi"
        },
        {
            "created": "2023-10-22",
            "email": "fabiomenvielle@gmail.com",
            "firstName": "Fabio",
            "isoLanguages": "es",
            "lastLogin": "2025-03-24",
            "lastName": "Menvielle"
        },
        {
            "created": "2023-07-25",
            "email": "andresleglise@gmail.com",
            "firstName": "Andrés",
            "isoLanguages": "es",
            "lastLogin": "2023-12-07",
            "lastName": "Leglise"
        },
        {
            "created": "2023-07-18",
            "email": "martinezme1977@gmail.com",
            "firstName": "mauricio",
            "isoLanguages": "es",
            "lastLogin": "2024-10-03",
            "lastName": "martinez"
        },
        {
            "created": "2023-04-24",
            "email": "anugalsursa@gmail.com",
            "firstName": "hernan",
            "isoLanguages": "es",
            "lastLogin": "2025-02-18",
            "lastName": "peñalva"
        },
        {
            "created": "2022-07-11",
            "email": "optarasca@gmail.com",
            "firstName": "Octavio",
            "isoLanguages": "es",
            "lastLogin": "2023-06-14",
            "lastName": "Palacio"
        },
        {
            "created": "2023-07-26",
            "email": "mateogrosse@gmail.com",
            "firstName": "Mateo",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Grosse"
        },
        {
            "created": "2023-04-12",
            "email": "gustavolange1519@gmail.com",
            "firstName": "Gustavo",
            "isoLanguages": "es",
            "lastLogin": "2023-05-15",
            "lastName": "Lange"
        },
        {
            "created": "2022-07-06",
            "email": "alvaroducasse@gmail.com",
            "firstName": "Alvaro",
            "isoLanguages": "es,en",
            "lastLogin": "2024-03-08",
            "lastName": "Ducasse"
        },
        {
            "created": "2023-11-06",
            "email": "fiorchis@hotmail.com",
            "firstName": "",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": ""
        },
        {
            "created": "2024-12-26",
            "email": "gastontillet@gmail.com",
            "firstName": "Gaston",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Tillet"
        },
        {
            "created": "2023-06-28",
            "email": "fidelpoehls@gmail.com",
            "firstName": "Fidel",
            "isoLanguages": "es",
            "lastLogin": "2025-04-07",
            "lastName": "Poehls"
        },
        {
            "created": "2023-07-10",
            "email": "maxipiova@gmail.com",
            "firstName": "Maximiliano",
            "isoLanguages": "es",
            "lastLogin": "2023-09-05",
            "lastName": "Piovacari"
        },
        {
            "created": "2023-04-06",
            "email": "alejandrogual@gmail.com",
            "firstName": "Alejandro",
            "isoLanguages": "es",
            "lastLogin": "2023-08-25",
            "lastName": "Gual"
        },
        {
            "created": "2024-03-14",
            "email": "podesta95@gmail.com",
            "firstName": "sebastian",
            "isoLanguages": "es",
            "lastLogin": "2024-10-29",
            "lastName": "podesta"
        },
        {
            "created": "2024-12-26",
            "email": "tagle.nicolas@gmail.com",
            "firstName": "Nicolas",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Tagle"
        },
        {
            "created": "2023-11-08",
            "email": "ferrarivirginia@gmail.com",
            "firstName": "Virginia",
            "isoLanguages": "es",
            "lastLogin": "2024-06-11",
            "lastName": "Ferrari"
        },
        {
            "created": "2024-04-27",
            "email": "juancruzorsi123@gmail.com",
            "firstName": "Juan Cruz",
            "isoLanguages": "es",
            "lastLogin": "2025-04-10",
            "lastName": "Orsi"
        },
        {
            "created": "2023-09-27",
            "email": "gonzaropero@gmail.com",
            "firstName": "Gonzalo",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Ropero"
        },
        {
            "created": "2025-02-26",
            "email": "derdoyjoaco@gmail.com",
            "firstName": "Joaco",
            "isoLanguages": "es",
            "lastLogin": "2025-03-05",
            "lastName": "Derdoy"
        },
        {
            "created": "2023-06-22",
            "email": "juanchooacosta23@gmail.com",
            "firstName": "Juan",
            "isoLanguages": "es",
            "lastLogin": "2024-01-31",
            "lastName": "Acosta"
        },
        {
            "created": "2020-08-19",
            "email": "dleiva@geoagro.com",
            "firstName": "Danel",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Leiva"
        },
        {
            "created": "2025-02-27",
            "email": "miguelmariabraceras@gmail.com",
            "firstName": "Miguel M.",
            "isoLanguages": "es",
            "lastLogin": "2025-02-27",
            "lastName": "Braceras"
        },
        {
            "created": "2024-12-26",
            "email": "administracion@scyld.com.ar",
            "firstName": "Admin",
            "isoLanguages": "es",
            "lastLogin": "2024-12-26",
            "lastName": "Admin"
        },
        {
            "created": "2022-05-25",
            "email": "arielviscay@gmail.com",
            "firstName": "Ariel",
            "isoLanguages": "es",
            "lastLogin": "2025-03-05",
            "lastName": "Viscay"
        },
        {
            "created": "2023-03-08",
            "email": "pijuanmartin@gmail.com",
            "firstName": "Martin",
            "isoLanguages": "es",
            "lastLogin": "2024-07-12",
            "lastName": "Pijuan"
        },
        {
            "created": "2021-06-29",
            "email": "2266416967ct@gmail.com",
            "firstName": "Nicolás",
            "isoLanguages": "es",
            "lastLogin": "2023-12-14",
            "lastName": "Salamanco"
        },
        {
            "created": "2024-02-14",
            "email": "cami.orlando91@gmail.com",
            "firstName": "Camila",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Orlando"
        },
        {
            "created": "2022-03-09",
            "email": "2494004731ct@gmail.com",
            "firstName": "Evelyn",
            "isoLanguages": "es",
            "lastLogin": "2023-10-23",
            "lastName": "Coronel"
        },
        {
            "created": "2021-11-02",
            "email": "2266441747ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2023-10-30",
            "lastName": "Tolvas"
        },
        {
            "created": "2024-04-19",
            "email": "facundo@grupoavellanedahuergo.com",
            "firstName": "Facundo",
            "isoLanguages": "en",
            "lastLogin": "2024-04-28",
            "lastName": "Avellaneda Huergo"
        },
        {
            "created": "2022-07-27",
            "email": "agustin.giaq@gmail.com",
            "firstName": "AGUSTIN",
            "isoLanguages": "es",
            "lastLogin": "2023-08-10",
            "lastName": "GIAQUINTO"
        },
        {
            "created": "2021-06-29",
            "email": "gervasiolozasemprun@gmail.com",
            "firstName": "Gervasio",
            "isoLanguages": "es",
            "lastLogin": "2022-05-10",
            "lastName": "Loza Semprun"
        },
        {
            "created": "2023-09-05",
            "email": "kevin.etcheto@gmail.com",
            "firstName": "Kevin",
            "isoLanguages": "es",
            "lastLogin": "2024-06-12",
            "lastName": "Etcheto"
        },
        {
            "created": "2022-12-19",
            "email": "tatiquattro@gmail.com",
            "firstName": "Juan Agustin",
            "isoLanguages": "es",
            "lastLogin": "2025-04-10",
            "lastName": "Quattrocchio"
        },
        {
            "created": "2022-08-02",
            "email": "adalbertobutti@gmail.com",
            "firstName": "Adalberto",
            "isoLanguages": "es",
            "lastLogin": "2024-07-22",
            "lastName": "Butti"
        },
        {
            "created": "2025-04-15",
            "email": "lucianonthomas12@gmail.com",
            "firstName": "Luciano",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": ""
        },
        {
            "created": "2023-05-08",
            "email": "mariabilbao.91@gmail.com",
            "firstName": "Maria de Jesús",
            "isoLanguages": "es",
            "lastLogin": "2025-03-18",
            "lastName": "Bilbao"
        },
        {
            "created": "2020-08-13",
            "email": "sdiaz@geoagro.com",
            "firstName": "Santiago Raúl",
            "isoLanguages": "es",
            "lastLogin": "2024-09-17",
            "lastName": "Díaz - geoagro"
        },
        {
            "created": "2021-08-02",
            "email": "jcayzac@geoagro.com",
            "firstName": "Jaqueline",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Cayzac"
        },
        {
            "created": "2020-08-20",
            "email": "gt@geoagro.com",
            "firstName": "Gustavo Amilcar",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Teruggi"
        },
        {
            "created": "2022-03-16",
            "email": "2494270396ct@gmail.com",
            "firstName": "Maribel",
            "isoLanguages": "es",
            "lastLogin": "2025-04-05",
            "lastName": "Capra"
        },
        {
            "created": "2025-04-15",
            "email": "2494023403ct@gmail.com",
            "firstName": "Stefania",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Perez"
        },
        {
            "created": "2020-08-19",
            "email": "zoilocamargo@gmail.com",
            "firstName": "zoilo martin",
            "isoLanguages": "es",
            "lastLogin": "2025-02-11",
            "lastName": "camargo"
        },
        {
            "created": "2020-08-19",
            "email": "ed@geoagro.com",
            "firstName": "Ed",
            "isoLanguages": "es",
            "lastLogin": "2025-04-14",
            "lastName": "Di Pollina"
        },
        {
            "created": "2025-01-08",
            "email": "marcos.cardelli@gmail.com",
            "firstName": "Marcos",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Cardelli"
        },
        {
            "created": "2020-08-24",
            "email": "milanita2012@gmail.com",
            "firstName": "Jose",
            "isoLanguages": "es",
            "lastLogin": "2025-04-11",
            "lastName": "Lezama"
        },
        {
            "created": "2025-02-17",
            "email": "enriquearecoh@gmail.com",
            "firstName": "Enrique",
            "isoLanguages": "es",
            "lastLogin": "2025-04-07",
            "lastName": "Areco"
        },
        {
            "created": "2023-07-24",
            "email": "lucianomartinez542@gmail.com",
            "firstName": "Luciano",
            "isoLanguages": "es",
            "lastLogin": "2024-09-13",
            "lastName": "Martinez"
        },
        {
            "created": "2020-08-13",
            "email": "gf@geoagro.com",
            "firstName": "Georgina",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Ferro"
        },
        {
            "created": "2024-05-21",
            "email": "carnesdelsudoeste@gmail.com",
            "firstName": "Carnes",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Sudoeste"
        },
        {
            "created": "2024-09-11",
            "email": "tomas.salaverria@gmail.com",
            "firstName": "Tomas",
            "isoLanguages": "es",
            "lastLogin": "2024-09-12",
            "lastName": "Sala"
        },
        {
            "created": "2020-09-07",
            "email": "germaneberg@gmail.com",
            "firstName": "German",
            "isoLanguages": "es",
            "lastLogin": "2025-03-26",
            "lastName": "Berg"
        },
        {
            "created": "2024-05-16",
            "email": "tbracco@agro.uba.ar",
            "firstName": "Tomás",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Bracco"
        },
        {
            "created": "2022-08-13",
            "email": "anaiturcato@gmail.com",
            "firstName": "Ana",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "turcato"
        },
        {
            "created": "2021-06-07",
            "email": "francogavegno@gmail.com",
            "firstName": "Franco",
            "isoLanguages": "es",
            "lastLogin": "2025-01-02",
            "lastName": "Gavegno"
        },
        {
            "created": "2024-05-02",
            "email": "gavegnofranco@gmail.com",
            "firstName": "Franco",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Gavegno"
        },
        {
            "created": "2023-06-07",
            "email": "hugo.cultivos@gmail.com",
            "firstName": "Hugo",
            "isoLanguages": "es,en",
            "lastLogin": "2025-02-03",
            "lastName": "Gonzalez Abba"
        },
        {
            "created": "2020-09-30",
            "email": "jmartin.maisterrena@gmail.com",
            "firstName": "Juan",
            "isoLanguages": "es",
            "lastLogin": "2025-01-14",
            "lastName": "Maisterrena"
        },
        {
            "created": "2023-06-27",
            "email": "juanmujica75@gmail.com",
            "firstName": "Juan Luis",
            "isoLanguages": "es",
            "lastLogin": "2025-04-07",
            "lastName": "Mujica"
        },
        {
            "created": "2022-07-20",
            "email": "2923573374ctp@gmail.com",
            "firstName": "Regina Ceres",
            "isoLanguages": "es",
            "lastLogin": "2024-05-20",
            "lastName": "Tolvas"
        },
        {
            "created": "2023-07-04",
            "email": "juan.aenlle@gmail.com",
            "firstName": "Juancito",
            "isoLanguages": "es",
            "lastLogin": "2025-03-20",
            "lastName": "Aenlle"
        },
        {
            "created": "2022-09-26",
            "email": "dbeliera@live.com",
            "firstName": "Diego",
            "isoLanguages": "es",
            "lastLogin": "2025-02-26",
            "lastName": "Beliera"
        },
        {
            "created": "2024-09-30",
            "email": "roperoagropecuaria@gmail.com",
            "firstName": "Miguel Maria",
            "isoLanguages": "es",
            "lastLogin": "2025-04-12",
            "lastName": "Braceras"
        },
        {
            "created": "2022-03-14",
            "email": "acuello@geoagro.com",
            "firstName": "Adrian",
            "isoLanguages": "es",
            "lastLogin": "2025-03-25",
            "lastName": "Cuello"
        },
        {
            "created": "2021-07-28",
            "email": "tolvasbelgrano@gmail.com",
            "firstName": "tolvas",
            "isoLanguages": "es",
            "lastLogin": "2024-09-12",
            "lastName": "belgrano"
        },
        {
            "created": "2022-08-25",
            "email": "aguero@agro.uba.ar",
            "firstName": "Marcos Jose",
            "isoLanguages": "es",
            "lastLogin": "2024-07-24",
            "lastName": "Aguero"
        },
        {
            "created": "2023-11-21",
            "email": "jkrat@geoagro.com",
            "firstName": "Joel",
            "isoLanguages": "es",
            "lastLogin": "2025-04-16",
            "lastName": "Krat"
        },
        {
            "created": "2022-12-23",
            "email": "acorrea@geoagro.com",
            "firstName": "Andres",
            "isoLanguages": "es",
            "lastLogin": "2025-04-14",
            "lastName": "Correa"
        },
        {
            "created": "2022-08-02",
            "email": "magiio.1974@gmail.com",
            "firstName": "Franco",
            "isoLanguages": "es",
            "lastLogin": "2025-04-10",
            "lastName": "Maggioni"
        },
        {
            "created": "2020-08-19",
            "email": "santiagotorresllano@gmail.com",
            "firstName": "Santiago",
            "isoLanguages": "es",
            "lastLogin": "2025-03-31",
            "lastName": "Torres"
        },
        {
            "created": "2024-12-18",
            "email": "mahemacrops@gmail.com",
            "firstName": "Hernan",
            "isoLanguages": "es",
            "lastLogin": "2025-02-26",
            "lastName": "Capaldi"
        },
        {
            "created": "2020-08-19",
            "email": "lbarale@geoagro.com",
            "firstName": "Lucia",
            "isoLanguages": "es",
            "lastLogin": "2025-04-16",
            "lastName": "Barale"
        },
        {
            "created": "2024-05-30",
            "email": "agustinlongarini6@gmail.com",
            "firstName": "Agustín",
            "isoLanguages": "es",
            "lastLogin": "2025-01-19",
            "lastName": "Longarini"
        },
        {
            "created": "2025-04-11",
            "email": "2284692475ct@gmail.com",
            "firstName": "Matias",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Held"
        },
        {
            "created": "2022-08-18",
            "email": "fgarda@gmail.com",
            "firstName": "Fernando",
            "isoLanguages": "es",
            "lastLogin": "2025-04-06",
            "lastName": "Garda"
        },
        {
            "created": "2021-12-26",
            "email": "mbonelli@geoagro.com",
            "firstName": "Mariano",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Bonelli"
        },
        {
            "created": "2021-07-13",
            "email": "harispehernan@gmail.com",
            "firstName": "Hernan",
            "isoLanguages": "es",
            "lastLogin": "2025-03-21",
            "lastName": "Harispe"
        },
        {
            "created": "2025-03-05",
            "email": "2494006529ct@gmail.com",
            "firstName": "Ceres",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Tolvas"
        },
        {
            "created": "2022-03-29",
            "email": "francojignacio@gmail.com",
            "firstName": "juan",
            "isoLanguages": "es",
            "lastLogin": "2025-03-08",
            "lastName": "ignacio"
        },
        {
            "created": "2024-09-12",
            "email": "orivemartin.mo@gmail.com",
            "firstName": "felipe",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Orive"
        },
        {
            "created": "2024-12-09",
            "email": "2494023438ct@gmail.com",
            "firstName": "Tomás",
            "isoLanguages": "es",
            "lastLogin": "2025-04-14",
            "lastName": "Bracco"
        },
        {
            "created": "2024-11-15",
            "email": "magustinafogel@gmail.com",
            "firstName": "María Agustina",
            "isoLanguages": "es",
            "lastLogin": "2024-12-19",
            "lastName": "Fogel Masson"
        },
        {
            "created": "2024-06-11",
            "email": "sacarp2001@gmail.com",
            "firstName": "Santiago",
            "isoLanguages": "es",
            "lastLogin": "2025-01-06",
            "lastName": "Acosta"
        },
        {
            "created": "2020-08-13",
            "email": "marianoacunia@gmail.com",
            "firstName": "Mariano",
            "isoLanguages": "es",
            "lastLogin": "2024-12-27",
            "lastName": "Acuña"
        },
        {
            "created": "2025-01-04",
            "email": "cabeza1392@gmail.com",
            "firstName": "Cabeza",
            "isoLanguages": "es",
            "lastLogin": "",
            "lastName": "Elliot"
        },
        {
            "created": "2023-08-29",
            "email": "jfpiperno@gmail.com",
            "firstName": "Franco",
            "isoLanguages": "es",
            "lastLogin": "2025-03-10",
            "lastName": "Piperno"
        },
        {
            "created": "2022-11-23",
            "email": "tvarela@geoagro.com",
            "firstName": "Thomas",
            "isoLanguages": "es",
            "lastLogin": "2025-04-13",
            "lastName": "Varela"
        },
        {
            "created": "2021-06-04",
            "email": "fgavegno@geoagro.com",
            "firstName": "Franco",
            "isoLanguages": "es",
            "lastLogin": "2025-04-16",
            "lastName": "Gavegno"
        },
        {
            "created": "2023-05-21",
            "email": "agoni@geoagro.com",
            "firstName": "Agustina ",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Goñi"
        },
        {
            "created": "2023-04-17",
            "email": "hmmarino@gmail.com",
            "firstName": "Martín",
            "isoLanguages": "es",
            "lastLogin": "2025-02-25",
            "lastName": "Marino"
        },
        {
            "created": "2021-07-23",
            "email": "fmaggioni@geoagro.com",
            "firstName": "Franco",
            "isoLanguages": "es",
            "lastLogin": "2025-04-14",
            "lastName": "Maggioni"
        },
        {
            "created": "2022-07-04",
            "email": "nsoria@geoagro.com",
            "firstName": "Nicolas",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Soria"
        },
        {
            "created": "2021-06-09",
            "email": "lozanot91@gmail.com",
            "firstName": "tomas",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "lozano"
        },
        {
            "created": "2020-08-13",
            "email": "vs@geoagro.com",
            "firstName": "Victoria",
            "isoLanguages": "es",
            "lastLogin": "2025-04-11",
            "lastName": "Soda"
        },
        {
            "created": "2023-12-27",
            "email": "svila@geoagro.com",
            "firstName": "Sebastian",
            "isoLanguages": "es",
            "lastLogin": "2025-04-16",
            "lastName": "Vila"
        },
        {
            "created": "2020-08-19",
            "email": "dbernardi@geoagro.com",
            "firstName": "Diego",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "Bernardi"
        },
        {
            "created": "2022-06-27",
            "email": "facundoseda@gmail.com",
            "firstName": "facundo",
            "isoLanguages": "es",
            "lastLogin": "2025-04-15",
            "lastName": "vaca"
        }
    ]
}
