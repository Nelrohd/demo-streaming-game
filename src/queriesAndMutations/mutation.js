import gql from "graphql-tag";

export const playSoloMoment = gql`
  mutation playSoloMoment($playSoloMomentInput: PlayMomentInput) {
    playSoloMoment(playSoloMomentInput: $playSoloMomentInput) {
      gameSessionId
      edgeNodeId
    }
  }
`;

export const createTransactionV2 = gql`
  mutation CreateTransactionV2(
    $createTransactionV2Input: CreateTransactionV2Input!
  ) {
    createTransactionV2(createTransactionV2Input: $createTransactionV2Input) {
      type
      currency
      balance
    }
  }
`;
