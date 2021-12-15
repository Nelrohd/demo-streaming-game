import apollo from "../clients/apollo";
import {
  playSoloMoment,
  createTransactionV2,
} from "../queriesAndMutations/mutation";
import { listGames, listMomentsV2 } from "../queriesAndMutations/queries";

const apolloClient = apollo.getInstance();

export class GameSessions {
  static playSoloMoment = async (params) => {
    const response = await apolloClient.mutate({
      mutation: playSoloMoment,
      variables: { playSoloMomentInput: params },
    });
    return response.data.playSoloMoment;
  };

  static listGames = async (status) => {
    const response = await apolloClient.query({
      query: listGames,
      variables: { status },
    });

    return response.data.listGames;
  };

  static getListMoment = async (appId, status) => {
    const res = await apolloClient.query({
      query: listMomentsV2,
      variables: { appId, status },
    });

    return res.data.listMomentsV2;
  };

  static createTransactionV2 = async (key, data) => {
    const res = await apolloClient.mutate({
      mutation: createTransactionV2,
      variables: {
        createTransactionV2Input: { key },
      },
    });
    return res.data.createTransactionV2[0];
  };
}
