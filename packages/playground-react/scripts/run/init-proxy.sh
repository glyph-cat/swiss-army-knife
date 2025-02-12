# NOTE: When using `ln`, target paths must be absolute

# proxy_dir="./src/~proxy"
# if [ ! -d $proxy_dir ]; then
#   mkdir $proxy_dir
# fi

# core_dir="$proxy_dir/core"
# if [ -d $core_dir ]; then
#   rm $core_dir
# fi
# ln -s ${PWD/"playground-react"/core} $core_dir

# react_dir="$proxy_dir/react"
# if [ -d $react_dir ]; then
#   rm $react_dir
# fi
# ln -s ${PWD/"playground-react"/react} $react_dir

# react_module_dir="$PWD/node_modules/react"
# if [ -d $react_module_dir ]; then
#   if test -L $react_module_dir; then
#     rm $react_module_dir
#   else
#     rm -r $react_module_dir
#   fi
# fi
# ln -s "${PWD/"playground-react"/react}/node_modules/react" $react_module_dir

# react_dom_module_dir="$PWD/node_modules/react-dom"
# if [ -d $react_dom_module_dir ]; then
#   if test -L $react_dom_module_dir; then
#     rm $react_dom_module_dir
#   else
#     rm -r $react_dom_module_dir
#   fi
# fi
# ln -s "${PWD/"playground-react"/react}/node_modules/react-dom" $react_dom_module_dir
