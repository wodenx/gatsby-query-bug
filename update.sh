for i in {1..1000}
  do
    echo Updating: iteration $i
    sed -i .bak s/x/xx/ src/data/pages/foo.json
    sleep 5
  done
