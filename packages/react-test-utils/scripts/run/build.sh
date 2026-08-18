set -e

rushx clean
rushx bundle
rushx types
rushx api
