set -e

rushx clean
rushx bundle
rushx types
rushx api

rm -r ./temp/tsc
