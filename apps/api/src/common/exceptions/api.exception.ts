import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    message: string,
    code: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(
      {
        message,
        code,
        details,
      },
      statusCode,
    );
  }
}

export class ValidationException extends ApiException {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', HttpStatus.BAD_REQUEST, details);
  }
}

export class AuthenticationException extends ApiException {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_FAILED', HttpStatus.UNAUTHORIZED);
  }
}

export class AuthorizationException extends ApiException {
  constructor(message: string = 'Access denied') {
    super(message, 'ACCESS_DENIED', HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends ApiException {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends ApiException {
  constructor(message: string = 'Resource already exists') {
    super(message, 'CONFLICT', HttpStatus.CONFLICT);
  }
}

export class BusinessLogicException extends ApiException {
  constructor(message: string, code?: string) {
    super(message, code || 'BUSINESS_LOGIC_ERROR', HttpStatus.BAD_REQUEST);
  }
}
