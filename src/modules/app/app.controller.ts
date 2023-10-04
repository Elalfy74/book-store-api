import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  @Get()
  @Redirect('/docs')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  redirect() {}
}
