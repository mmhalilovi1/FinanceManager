import { createParamDecorator } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    }
);