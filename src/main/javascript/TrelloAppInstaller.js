import { InstallError } from './InstallError';

export class TrelloAppInstaller
{
  constructor({ customField })
  {
    this.props = { customField };
  }

  /**
   * @param dpapp
   * @return {Promise.<{timestamp: int}>}
   */
  async tryInstall(dpapp)
  {
    const { state, restApi } = dpapp;

    return state.getAppState('install', null)
      .then(install => install || restApi.get('/me')
        .then((me) => me.status === 'success' ? me.body.data.person : null)
        .then((me) => me && me.can_admin ? this.install(dpapp) : Promise.reject(InstallError.notAuthorizedError()))
      )
    ;
  }

  /**
   * @param dpapp
   * @return {Promise.<{timestamp: int}>}
   */
  async install(dpapp)
  {
    const { state } = dpapp;
    return this.addCustomField(dpapp)
      .then(() => {
        const install = { timestamp: Math.round(new Date().getTime()/1000) };
        return state.setAppState('install', install).then(() => install);
      })
    ;
  }

  /**
   * @param dpapp
   * @return {Promise.<*>}
   */
  async addCustomField(dpapp)
  {
    const { customField } = this.props;
    const { restApi } = dpapp;

    const requestBody = {
      title: customField,
      is_enabled: true,
      alias: customField,
      handler_class: "Application\\DeskPRO\\CustomFields\\Handler\\DataJson"
    };

    return restApi.post('ticket_custom_fields', requestBody);
  }
}