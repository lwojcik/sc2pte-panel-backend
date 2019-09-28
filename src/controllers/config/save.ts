interface ConfigObject {
  regionId: string;
  realmId: string;
  profileId: string;
}

type ConfigObjectArray = ConfigObject[];

const saveConfig = (channelId: string | number, data: ConfigObjectArray) => {
  console.log(channelId);
  console.log(data);
  console.log('config saved');
  return {
      status: 200,
      message: "postConfig",
      channelId,
    }
}

export default saveConfig;