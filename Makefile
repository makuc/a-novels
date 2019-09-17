.phony: rules

rules:
	cls
	firebase deploy --only firestore:rules

serve:
	cls
	ng serve