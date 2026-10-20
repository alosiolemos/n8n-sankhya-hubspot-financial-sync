var run_index = $thisRunIndex;
var after = items[0].json.after;

if (run_index == 0){
  return{
    after: 0,
    run_index: run_index
  }
}

else{
  return{
    after: after,
    run_index: run_index
  }
}
