// Help function to generate an IAM policy
export const generatePolicy = (principalId: string, effect: string, resource: string, context: any) => {

  const statementOne: any = {
    Action: "execute-api:Invoke",
    Effect: effect,
    Resource: resource,
  };

  const policyDocument = {
    Statement: [statementOne],
    Version: "2012-10-17",
  };

  const policy = {
    context,
    policyDocument,
    principalId,
  };
  return policy;
};
