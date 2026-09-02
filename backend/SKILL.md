# Backend Coding Conventions & Structure

This document outlines the standard coding structure and conventions for the backend project, specifically designed for use with NestJS modules.

## 1. Directory Structure
Every module follows a consistent structure within `/src/modules/<module-name>/`:

- `<module-name>.controller.ts`: Handles HTTP requests, input validation, and routing. Uses Swagger decorators.
- `<module-name>.service.ts`: Business logic and orchestration.
- `<module-name>.module.ts`: NestJS module definition, importing and exporting providers.
- `dto/`: Contains all Data Transfer Objects (DTOs) for the module.

## 2. Coding Conventions

### NestJS
- **Dependency Injection**: Use constructor injection for services (`private readonly service: ServiceName`).
- **Error Handling**: Use NestJS built-in exceptions (`BadRequestException`, `NotFoundException`, `InternalServerErrorException`) to maintain standardized error responses.

### Swagger/OpenAPI
- Controllers must be documented with `@ApiTags`, `@ApiOperation`, and `@ApiResponse` decorators to ensure consistent API documentation.

### Data Access & DTOs
- **Prisma**: All database interactions should be handled via the injected `PrismaService`.
- **DTOs**:
  - DTOs are used for both request bodies (`@Body()`) and response formats.
  - When returning data, create a DTO class (e.g., `FileResponseDto`) and map database entities to it.
  - Follow the naming convention `<action><Name>Dto.ts` for input DTOs and `<Name>ResponseDto.ts` for output DTOs.

### Example Pattern
Follow this architectural flow:
1. **Controller**: Receives request -> Calls Service.
2. **Service**: Validates logic -> Interacts with Repository/Services (S3, Prisma, etc.) -> Transforms result using a DTO -> Returns to Controller.

Ensure all new modules adhere to this established pattern to maintain codebase consistency.
