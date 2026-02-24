// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Set public permissions for service API endpoints
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      // Enable service API permissions
      const servicePermissions = await strapi
        .query('plugin::users-permissions.permission')
        .findMany({
          where: {
            role: publicRole.id,
            action: {
              $in: ['api::service.service.find', 'api::service.service.findOne'],
            },
          },
        });

      for (const permission of servicePermissions) {
        await strapi
          .query('plugin::users-permissions.permission')
          .update({
            where: { id: permission.id },
            data: { enabled: true },
          });
      }

      // Enable upload permissions for public role
      const uploadPermissions = await strapi
        .query('plugin::users-permissions.permission')
        .findMany({
          where: {
            role: publicRole.id,
            action: {
              $in: ['plugin::upload.content-api.upload'],
            },
          },
        });

      for (const permission of uploadPermissions) {
        await strapi
          .query('plugin::users-permissions.permission')
          .update({
            where: { id: permission.id },
            data: { enabled: true },
          });
      }

      strapi.log.info('Public permissions set for service API endpoints');
    }
  },
};
