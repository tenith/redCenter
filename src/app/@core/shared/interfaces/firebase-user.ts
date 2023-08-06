/*
    01 Mar 2023 wutthichair
        Init this file and add required properties that we will get from firebase after completed authenthication
        Ex. 
        {
            "uid":"qMdC1gFzWXV5AwEkhLzmMNArLTF2",
            "email":"wutthichair@airasia.com",
            "emailVerified":true,
            "displayName":"Wutthichai Ratanapornsompong -",
            "isAnonymous":false,
            "photoURL":"https://lh3.googleusercontent.com/a/ALm5wu3xurPUVQZFKEpAGKstsUR952v7i8exBUoasHk=s96-c",
            "providerData":[
                {
                    "providerId":"google.com",
                    "uid":"110748099569006389822",
                    "displayName":"Wutthichai Ratanapornsompong -",
                    "email":"wutthichair@airasia.com",
                    "phoneNumber":null,
                    "photoURL":"https://lh3.googleusercontent.com/a/AGNmyxbynUUoYAydPDEptyZl3vSH9jCKd_rPZkQgmI8=s96-c"
                }
            ],
            "stsTokenManager":{
                "refreshToken":"APJWN8eUDoEyJXstuR6udB3BK8-MECP6jL9BnJ8cRmMaz20AO7h4zLpyJwPXQd3xN98yOlsz95wM_6AoVo4JEph3WMBYmcrrCYhAD3056tGMQ_d33MP-sakle5MLoOQJz9B65WU5QKmuxBA24pWdsDUHFzkRBdad45iXEgnvsDfHn4L5uTiUV4Jg8VGFL0spRvsfgk85iN4-o3WnCnMpgg_ke_pFBiHVvp3dbotq00WdZsq0rbl-c9Oy7DH_YwIG0NSP1oDR3-wbPej9V5sk141BzAMvXSPgXOGN-WixM2KH0tmzPxsgDpLubY8Xauvc3053QNxE_-MiLyQ8d8QXu8vnSM7ZPU74ax5wrk0TCn-SISSH_c1zaRvzV05FjSgQJHycSe9QBiAm2r4cRpZSxRf4sBzrEahb52MXB0mt48RxRpzFPDxOflHVvUtp3BuL2ANjLo0VKX_Z",
                "accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImY4NzZiNzIxNDAwYmZhZmEyOWQ0MTFmZTYwODE2YmRhZWMyM2IzODIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiV3V0dGhpY2hhaSBSYXRhbmFwb3Juc29tcG9uZyAtIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTN4dXJQVVZRWkZLRXBBR0tzdHNVUjk1MnY3aThleEJVb2FzSGs9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVkYm9vay10YWEiLCJhdWQiOiJyZWRib29rLXRhYSIsImF1dGhfdGltZSI6MTY3NzY2Mzg0MSwidXNlcl9pZCI6InFNZEMxZ0Z6V1hWNUF3RWtoTHptTU5BckxURjIiLCJzdWIiOiJxTWRDMWdGeldYVjVBd0VraEx6bU1OQXJMVEYyIiwiaWF0IjoxNjc3NjYzODQxLCJleHAiOjE2Nzc2Njc0NDEsImVtYWlsIjoid3V0dGhpY2hhaXJAYWlyYXNpYS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMDc0ODA5OTU2OTAwNjM4OTgyMiJdLCJlbWFpbCI6WyJ3dXR0aGljaGFpckBhaXJhc2lhLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.MCL9gIdkZBmlHHIvafLplGKFSMMIApZTEf4swYaexEB3TFk-RZ_PytJFL4S7D4MYYSZgoSoVpc10-qeqoA1XLgKENoQDNCXnphK30kFsT1cdPR8na0bSmQ1zeqJb7uOSRuj2XCf0mwxonlpeSM4gryendCHBelqaFoDglP5WAdQEkvGdAScKtCxXv2H_A-_tFHQ_5zqH1WkCwFXA7MFmkKAZzgmu5MrO2K8Sf3zT9TJpv_jadHfEa10IZ55bU1tFZdrPHZRH-BF6jizFia_DTO6uBFvDjYbzlj_Dd5BsxwCil0M7B-T_FQgw3-NNaAQGvu8saIp9ks3qF84U-nRrRw",
                "expirationTime":1677667442629
            },
            "createdAt":"1664556823800",
            "lastLoginAt":"1677663841421",
            "apiKey":"AIzaSyBNzq0vOMsBXMCrwD5rZKXmwNjIYWs0ZLg",
            "appName":"[DEFAULT]"
        }
*/
export interface FirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  isAnonymous: boolean;
  photoURL: string;
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
}
