import React, { useEffect } from 'react';
import axios from 'axios';

const TestApi = () => {
  useEffect(() => {
    const modifyContentTypes = async () => {
      const API_TOKEN = '330e002db19743d097b6adcc618da315aacb637dd1ca1c8622f2f07b4e0223b512b0962e1117a49c7bad0e7f636058f2eabef6d57702c92156e8cf949cc1bb76eaf1522df07ecea344f1bb73ad073e3dfc4d37e1329d5e0537f50b0193f491d4973c97afe6f627d7e7bd389355846596107473db00b1128731d31c7ac7931d1f';
      const STRAPI_URL = 'http://localhost:1337';

      // Helper function to make API requests
      const apiRequest = async (method, endpoint, data) => {
        try {
          const response = await axios({
            method,
            url: `${STRAPI_URL}${endpoint}`,
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            data,
          });
          console.log(`Success (${endpoint}):`, response.data);
        } catch (error) {
          console.error(`Error (${endpoint}):`, error.response?.data || error.message);
        }
      };

      // Step 1: Create/Update Components
      const components = [
        {
          uid: 'event-components.payment',
          category: 'event-components',
          schema: {
            attributes: {
              amount: { type: 'integer', required: true },
              user: { type: 'relation', relation: 'manyToOne', target: 'plugin::users-permissions.user' },
              method: { type: 'string' },
              date: { type: 'datetime' },
              confirmed_by: { type: 'relation', relation: 'manyToOne', target: 'plugin::users-permissions.user' },
            },
          },
        },
        {
          uid: 'event-components.donation',
          category: 'event-components',
          schema: {
            attributes: {
              amount: { type: 'integer', required: true },
              donor: { type: 'relation', relation: 'manyToOne', target: 'plugin::users-permissions.user' },
              date: { type: 'datetime' },
            },
          },
        },
        {
          uid: 'event-components.guest',
          category: 'event-components',
          schema: {
            attributes: {
              firstName: { type: 'string', required: true },
              lastName: { type: 'string' },
              phone: { type: 'string' },
            },
          },
        },
        {
          uid: 'event-components.item',
          category: 'event-components',
          schema: {
            attributes: {
              name: { type: 'string', required: true },
              price: { type: 'decimal' },
              description: { type: 'string' },
              image: { type: 'string' },
              retailer: { type: 'string' },
              quantity: { type: 'integer' },
              sold: { type: 'boolean', default: false },
              sold_by: { type: 'relation', relation: 'manyToOne', target: 'plugin::users-permissions.user' },
            },
          },
        },
      ];

      // Update/Create Components
      for (const component of components) {
        await apiRequest('PUT', `/content-type-builder/components/${component.uid}`, {
          component: {
            category: component.category,
            displayName: component.uid.split('.')[1],
            schema: component.schema,
          },
        });
      }

      // Step 2: Update/Create Content Types
      const contentTypes = [
        {
          uid: 'api::business-account.business-account',
          schema: {
            collectionName: 'business_accounts',
            info: {
              singularName: 'business-account',
              pluralName: 'business-accounts',
              displayName: 'business-account',
            },
            options: { draftAndPublish: true },
            attributes: {
              user: {
                type: 'relation',
                relation: 'oneToOne',
                target: 'plugin::users-permissions.user',
                inversedBy: 'business_account',
                required: true,
              },
              businessName: { type: 'string', required: true },
              businessId: { type: 'string', required: true },
              state: { type: 'enumeration', enum: ['pending', 'approved', 'rejected'], default: 'pending' },
              approvedBy: {
                type: 'relation',
                relation: 'manyToOne',
                target: 'plugin::users-permissions.user',
                inversedBy: 'business_accounts',
              },
            },
          },
        },
        {
          uid: 'api::event.event',
          schema: {
            collectionName: 'events',
            info: {
              singularName: 'event',
              pluralName: 'events',
              displayName: 'event',
              description: '',
            },
            options: { draftAndPublish: true },
            attributes: {
              title: { type: 'string', required: true },
              date: { type: 'datetime' },
              location: { type: 'string', required: true },
              state: { type: 'enumeration', enum: ['pending', 'active', 'closed'], default: 'pending' },
              owner: {
                type: 'relation',
                relation: 'manyToOne',
                target: 'plugin::users-permissions.user',
                inversedBy: 'events',
              },
              co_hosts: {
                type: 'relation',
                relation: 'manyToMany',
                target: 'plugin::users-permissions.user',
                inversedBy: 'co_hosts',
              },
              groups: {
                type: 'relation',
                relation: 'manyToMany',
                target: 'api::group.group',
                inversedBy: 'events',
              },
              shopping_list: {
                type: 'relation',
                relation: 'oneToOne',
                target: 'api::shoppinglist.shoppinglist',
                inversedBy: 'related_event',
              },
              payments: { type: 'component', repeatable: true, component: 'event-components.payment' },
              donations: { type: 'component', repeatable: true, component: 'event-components.donation' },
            },
          },
        },
        {
          uid: 'api::group.group',
          schema: {
            collectionName: 'groups',
            info: {
              singularName: 'group',
              pluralName: 'groups',
              displayName: 'groups',
              description: '',
            },
            options: { draftAndPublish: true },
            attributes: {
              title: { type: 'string' },
              guests: { type: 'component', repeatable: true, component: 'event-components.guest' },
              state: { type: 'enumeration', enum: ['pending', 'active'], default: 'pending' },
              owner: {
                type: 'relation',
                relation: 'manyToOne',
                target: 'plugin::users-permissions.user',
                inversedBy: 'groups',
              },
              events: {
                type: 'relation',
                relation: 'manyToMany',
                target: 'api::event.event',
                inversedBy: 'groups',
              },
            },
          },
        },
        {
          uid: 'api::invite.invite',
          schema: {
            collectionName: 'invites',
            info: {
              singularName: 'invite',
              pluralName: 'invites',
              displayName: 'invite',
            },
            options: { draftAndPublish: true },
            attributes: {
              user: {
                type: 'relation',
                relation: 'manyToOne',
                target: 'plugin::users-permissions.user',
                inversedBy: 'invites',
                required: true,
              },
              event: {
                type: 'relation',
                relation: 'manyToOne',
                target: 'api::event.event',
                inversedBy: 'events',
                required: true,
              },
              state: { type: 'enumeration', enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
              inviter: {
                type: 'relation',
                relation: 'manyToOne',
                target: 'plugin::users-permissions.user',
                inversedBy: 'invites',
                required: true,
              },
            },
          },
        },
        {
          uid: 'api::shoppinglist.shoppinglist',
          schema: {
            collectionName: 'shoppinglists',
            info: {
              singularName: 'shoppinglist',
              pluralName: 'shoppinglists',
              displayName: 'shoppinglist',
              description: '',
            },
            options: { draftAndPublish: true },
            attributes: {
              title: { type: 'string', required: true },
              items: { type: 'component', repeatable: true, component: 'event-components.item' },
              totalCost: { type: 'decimal' },
              deliveryOption: { type: 'enumeration', enum: ['self', 'delivery', 'concierge'], default: 'self' },
              state: { type: 'enumeration', enum: ['pending', 'active'], default: 'pending' },
              owner: {
                type: 'relation',
                relation: 'manyToOne',
                target: 'plugin::users-permissions.user',
                inversedBy: 'shoppinglists',
                required: true,
              },
              related_event: {
                type: 'relation',
                relation: 'oneToOne',
                target: 'api::event.event',
                inversedBy: 'shopping_list',
                required: false,
              },
            },
          },
        },
        {
          uid: 'api::user-setting.user-setting',
          schema: {
            collectionName: 'user_settings',
            info: {
              singularName: 'user-setting',
              pluralName: 'user-settings',
              displayName: 'user-setting',
              description: '',
            },
            options: { draftAndPublish: true },
            attributes: {
              user: {
                type: 'relation',
                relation: 'oneToOne',
                target: 'plugin::users-permissions.user',
                mappedBy: 'user_setting',
                required: true,
              },
              eventCreation: { type: 'boolean', default: true },
              shoppingListCreation: { type: 'boolean', default: true },
              groupCreation: { type: 'boolean', default: true },
              invites: { type: 'boolean', default: false },
              payments: { type: 'boolean', default: true },
              fundraiserClose: { type: 'boolean', default: true },
            },
          },
        },
      ];

      // Update/Create Content Types
      for (const contentType of contentTypes) {
        await apiRequest('PUT', `/content-type-builder/content-types/${contentType.uid}`, {
          contentType: contentType.schema,
        });
      }

      // Step 3: Delete Unwanted Content Types
      const contentTypesToDelete = [
        'api::product-catalog.product-catalog',
        'api::shoppingitem.shoppingitem',
      ];

      for (const uid of contentTypesToDelete) {
        await apiRequest('DELETE', `/content-type-builder/content-types/${uid}`, {});
      }

      console.log('All content types updated!');
    };

    modifyContentTypes();
  }, []);

  return (
    <div>
      <h1>Updating Strapi Content Types...</h1>
      <p>Check the console for logs (right-click &gt; Inspect &gt; Console).</p>
    </div>
  );
};

export default TestApi;