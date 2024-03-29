import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { ValidationBuilder, Validator } from '../validation'
import { Controller } from './controller'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }

  override buildValidators (httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldName: 'token', value: httpRequest.token }).required().build()
    ]
  }
}
