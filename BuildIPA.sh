#!/bin/sh

#  BuildIPA.sh
#  GetApp
#
#  Created by john on 2018/3/6.
#  Copyright © 2018年 john. All rights reserved.
rm -rf appName
mkdir appName
mkdir appName/Payload
cp -r appName.app appName/Payload/appName.app
cp Icon.png appName/iTunesArtwork
cd appName
zip -r appName.ipa Payload iTunesArtwork

exit 0
