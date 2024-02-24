import { AllowedSchema } from "express-json-validator-middleware"

export interface Redemption {
    team_name?: string,
    redeemed_at?: string
}

export const RedemptionRequestSchema: AllowedSchema = {
    type: "object",
    required: ["staff_pass_id"],
    properties: {
        staff_pass_id: {
            type: "string",
        }
    },
};
