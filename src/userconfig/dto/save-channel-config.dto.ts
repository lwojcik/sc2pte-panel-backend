export class SaveChannelConfigDto {
  readonly channelId: string;

  readonly profiles: {
    regionId: string;
    realmId: string;
    profileId: string;
    locale: string;
  }[];
}
